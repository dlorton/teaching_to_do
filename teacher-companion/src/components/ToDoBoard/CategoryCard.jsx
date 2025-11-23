import React, { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import Sortable from "sortablejs";
import AddTask from "./AddTask";
import TaskItem from "./TaskItem";

export default function CategoryCard({ user, listId, cat }) {
    const [name, setName] = useState(cat.name);
    const [editing, setEditing] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [collapsed, setCollapsed] = useState(true);


    const tasksRef = useMemo(
        () => collection(db, "users", user.uid, "lists", listId, "categories", cat.id, "tasks"),
        [user, listId, cat.id]
    );


    useEffect(() => {
        const q = query(tasksRef, orderBy("order", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setTasks(list);
        });
        return () => unsub();
    }, [tasksRef]);

    // Sortable for tasks within a category (guarded)
    const listRef = useRef(null);
    const sortableRef = useRef(null);
    useEffect(() => {
        const el = listRef.current;
        if (!el || tasks.length === 0) return;
        if (sortableRef.current) {
            try { sortableRef.current.destroy(); } catch { }
            sortableRef.current = null;
        }
        sortableRef.current = new Sortable(el, {
            group: "tasks",
            animation: 150,
            handle: ".task-drag-handle",
            ghostClass: "sortable-ghost",
            delay: 100,
            delayOnTouchOnly: true,
            forceFallback: true,
            onEnd: async () => {
                if (!listRef.current) return;
                const items = Array.from(listRef.current.children);
                const batch = writeBatch(db);
                items.forEach((child, idx) => {
                    const id = child.getAttribute("data-id");
                    if (id) batch.update(doc(tasksRef, id), { order: idx });
                });
                await batch.commit();
            },
        });
        return () => { try { sortableRef.current?.destroy(); } catch { } sortableRef.current = null; };
    }, [tasks.length, tasksRef]);

    const updateCatName = async () => {
        await updateDoc(doc(db, "users", user.uid, "lists", listId, "categories", cat.id), { name });
        setEditing(false);
    };


    const removeCat = async () => {
        if (!confirm("Delete this category and all its tasks?")) return;
        await deleteDoc(doc(db, "users", user.uid, "lists", listId, "categories", cat.id));
    };


    const addTask = async (text, dueDate) => {
        if (!text?.trim()) return;
        const count = (await getDocs(tasksRef)).size;
        
        // Parse date in local timezone to avoid UTC offset
        let parsedDate = null;
        if (dueDate) {
            const [year, month, day] = dueDate.split('-').map(Number);
            parsedDate = new Date(year, month - 1, day);
        }
        
        await addDoc(tasksRef, {
            text: text.trim(),
            order: count,
            isComplete: false,
            createdAt: serverTimestamp(),
            dueDate: parsedDate,
            subtasks: [],
        });
    };

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                {editing ? (
                    <div className="flex w-full flex-wrap items-center gap-2">
                        <input
                            className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && updateCatName()}
                        />
                        <button
                            className="inline-flex items-center rounded-md bg-teal-400 px-3 py-1 text-sm text-zinc-900"
                            onClick={updateCatName}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="category-drag-handle cursor-move text-zinc-500 hover:text-zinc-300" title="Drag to reorder category">
                            ⋮⋮
                        </span>
                        <button
                            className="text-teal-400 hover:text-teal-300"
                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                            onClick={() => setCollapsed((v) => !v)}
                            title={collapsed ? "Expand tasks" : "Collapse tasks"}
                        >
                            <span style={{ fontVariantEmoji: 'text' }}>{collapsed ? "▶" : "▼"}</span>
                        </button>
                        <h3 className="text-lg font-semibold text-zinc-100">
                            {cat.name} {tasks.length > 0 && <span className="text-sm text-zinc-400">({tasks.length})</span>}
                        </h3>
                    </div>
                )}
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        className="inline-flex items-center rounded-md border border-zinc-600 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-800"
                        onClick={() => setEditing((v) => !v)}
                    >
                        Edit
                    </button>
                    <button
                        className="inline-flex items-center rounded-md px-2 py-1 text-sm text-red-400 hover:bg-red-900/20"
                        onClick={removeCat}
                        title="Delete category"
                    >
                        🗑️
                    </button>
                </div>
            </div>


            {!collapsed && (
                <>
                    <AddTask onAdd={addTask} />


                    <ul ref={listRef} className="space-y-2">
                        {tasks.map((t) => (
                            <li key={t.id} data-id={t.id}>
                                <TaskItem user={user} listId={listId} catId={cat.id} task={t} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}