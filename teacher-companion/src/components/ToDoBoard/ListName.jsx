import React, { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    writeBatch,
} from "firebase/firestore";
import Sortable from "sortablejs";
import { auth, db } from "../../lib/firebase";
import AddCategory from "./AddCategory";
import CategoryCard from "./CategoryCard";

const cls = (...c) => c.filter(Boolean).join(" ");


export default function TodoBoard({ user }) {
    const [lists, setLists] = useState([]);
    const [activeListId, setActiveListId] = useState(null);
    const [editingTitle, setEditingTitle] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [showNewList, setShowNewList] = useState(false);
    const [categories, setCategories] = useState([]);

    const listsRef = useMemo(() => (user ? collection(db, "users", user.uid, "lists") : null), [user]);
    const catsRef = useMemo(() => (user && activeListId ? collection(db, "users", user.uid, "lists", activeListId, "categories") : null), [user, activeListId]);


    // Load lists
    useEffect(() => {
        if (!user || !listsRef) return;
        const q = query(listsRef, orderBy("order", "asc"));
        const unsub = onSnapshot(q, async (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setLists(list);
            
            // Auto-select first list or create default
            if (list.length === 0) {
                const docRef = await addDoc(listsRef, {
                    name: "My Tasks",
                    order: 0,
                    createdAt: serverTimestamp()
                });
                setActiveListId(docRef.id);
            } else if (!activeListId) {
                setActiveListId(list[0].id);
            }
        });
        return () => unsub();
    }, [user, listsRef]);

    // Load categories for active list
    useEffect(() => {
        if (!catsRef) return;
        const q = query(catsRef, orderBy("order", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setCategories(list);
        });
        return () => unsub();
    }, [catsRef]);

    // Sortable for categories (guarded)
    const listRef = useRef(null);
    const sortableRef = useRef(null);
    useEffect(() => {
        const el = listRef.current;
        if (!el || categories.length === 0) return;
        if (sortableRef.current) {
            try { sortableRef.current.destroy(); } catch { }
            sortableRef.current = null;
        }
        sortableRef.current = new Sortable(el, {
            animation: 150,
            handle: ".category-drag-handle",
            ghostClass: "sortable-ghost",
            delay: 100,
            delayOnTouchOnly: true,
            forceFallback: true,
            onEnd: async () => {
                if (!user || !listRef.current) return;
                const children = Array.from(listRef.current.children);
                const batch = writeBatch(db);
                children.forEach((child, idx) => {
                    const id = child.getAttribute("data-id");
                    if (id && activeListId) batch.update(doc(db, "users", user.uid, "lists", activeListId, "categories", id), { order: idx });
                });
                await batch.commit();
            },
        });
        return () => { try { sortableRef.current?.destroy(); } catch { } sortableRef.current = null; };
    }, [user?.uid, activeListId, categories.length]);

    const saveListName = async (next) => {
        setEditingTitle(false);
        if (!user || !activeListId || !next?.trim()) return;
        await setDoc(doc(db, "users", user.uid, "lists", activeListId), { name: next.trim() }, { merge: true });
    };

    const createNewList = async () => {
        if (!newListName?.trim() || !user) return;
        const count = lists.length;
        const docRef = await addDoc(listsRef, {
            name: newListName.trim(),
            order: count,
            createdAt: serverTimestamp()
        });
        setActiveListId(docRef.id);
        setNewListName("");
        setShowNewList(false);
    };

    const deleteList = async () => {
        if (!activeListId || lists.length <= 1) {
            alert("Cannot delete your only list!");
            return;
        }
        const activeList = lists.find(l => l.id === activeListId);
        if (!confirm(`Delete "${activeList?.name}" and all its content?`)) return;
        await deleteDoc(doc(db, "users", user.uid, "lists", activeListId));
        setActiveListId(lists[0].id === activeListId ? lists[1]?.id : lists[0]?.id);
    };


    const addCategory = async (name) => {
        if (!name?.trim() || !user || !catsRef) return;
        const count = (await getDocs(catsRef)).size;
        await addDoc(catsRef, { name: name.trim(), order: count, createdAt: serverTimestamp() });
    };

    const activeList = lists.find(l => l.id === activeListId);
    if (!activeList) return <div className="w-full px-4 py-6 text-zinc-400">Loading...</div>;

    return (
        <div className="w-full px-4 py-6 md:px-6">
            <header className="mb-6 border-b border-zinc-800 pb-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-lg font-medium text-zinc-100 outline-none focus:border-teal-400"
                            value={activeListId || ""}
                            onChange={(e) => setActiveListId(e.target.value)}
                        >
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                        {!showNewList ? (
                            <>
                                <button
                                    className="inline-flex items-center rounded-md border border-zinc-600 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                    onClick={() => setShowNewList(true)}
                                >
                                    + New List
                                </button>
                                <button
                                    className="inline-flex items-center rounded-md border border-zinc-600 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                                    onClick={() => setEditingTitle(true)}
                                >
                                    Rename List
                                </button>
                                <button
                                    className="inline-flex items-center rounded-md border border-red-600 px-3 py-2 text-sm text-red-400 hover:bg-red-900/20"
                                    onClick={deleteList}
                                    title="Delete list"
                                >
                                    Delete List
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-400"
                                    placeholder="List name..."
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") createNewList();
                                        if (e.key === "Escape") { setShowNewList(false); setNewListName(""); }
                                    }}
                                    autoFocus
                                />
                                <button className="px-2 text-teal-400 hover:text-teal-300" onClick={createNewList}>✓</button>
                                <button className="px-2 text-zinc-400 hover:text-zinc-300" onClick={() => { setShowNewList(false); setNewListName(""); }}>✕</button>
                            </div>
                        )}
                        {editingTitle && (
                            <div className="flex items-center gap-2">
                                <input
                                    className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-400"
                                    placeholder="New list name..."
                                    defaultValue={activeList.name}
                                    onBlur={(e) => saveListName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveListName(e.currentTarget.value);
                                        if (e.key === "Escape") setEditingTitle(false);
                                    }}
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="inline-flex items-center rounded-md bg-zinc-700 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-600"
                            onClick={() => signOut(auth)}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <AddCategory onAdd={addCategory} />


            <div ref={listRef} className="flex flex-col gap-4">
                {categories.map((c) => (
                    <div key={c.id} data-id={c.id} className="w-full">
                        <CategoryCard user={user} listId={activeListId} cat={c} />
                    </div>
                ))}
            </div>
        </div>
    );
}