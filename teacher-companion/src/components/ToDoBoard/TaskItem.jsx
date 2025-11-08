import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import Subtasks from "./Subtasks";


const cls = (...c) => c.filter(Boolean).join(" ");
const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const todayClass = (date) => {
    const now = new Date();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (due < t) return "text-red-400";
    if (due.getTime() === t.getTime()) return "text-amber-400";
    return "text-zinc-400";
};


export default function TaskItem({ user, catId, task }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(task.text);
    const [due, setDue] = useState(task.dueDate ? new Date(task.dueDate.toDate ? task.dueDate.toDate() : task.dueDate) : null);


    useEffect(() => setText(task.text), [task.text]);


    const taskRef = useMemo(() => doc(db, "users", user.uid, "categories", catId, "tasks", task.id), [user, catId, task.id]);


    const toggleDone = async (v) => {
        if (v && task.subtasks?.length) {
            const updated = task.subtasks.map((s) => ({ ...s, isComplete: true }));
            await updateDoc(taskRef, { isComplete: v, subtasks: updated });
        } else {
            await updateDoc(taskRef, { isComplete: v });
        }
    };

    const save = async () => {
        const payload = { text };
        if (due === "") payload.dueDate = null;
        else if (due instanceof Date) payload.dueDate = due;
        await updateDoc(taskRef, payload);
        setEditing(false);
    };


    const remove = async () => {
        if (!confirm("Delete this task?")) return;
        await deleteDoc(taskRef);
    };


    const addSubtask = async (txt) => {
        if (!txt?.trim()) return;
        const snap = await getDoc(taskRef);
        const cur = snap.data();
        const subtasks = cur.subtasks || [];
        subtasks.push({ text: txt.trim(), isComplete: false, createdAt: new Date() });
        await updateDoc(taskRef, { subtasks });
    };


    const toggleSub = async (idx, v) => {
        const snap = await getDoc(taskRef);
        const cur = snap.data();
        const subtasks = cur.subtasks || [];
        if (subtasks[idx]) subtasks[idx].isComplete = v;
        await updateDoc(taskRef, { subtasks });
    };

    const delSub = async (idx) => {
        const snap = await getDoc(taskRef);
        const cur = snap.data();
        const subtasks = cur.subtasks || [];
        subtasks.splice(idx, 1);
        await updateDoc(taskRef, { subtasks });
    };


    const createdAt = task.createdAt?.toDate ? task.createdAt.toDate() : task.createdAt;
    const human = createdAt
        ? (() => {
            const now = new Date();
            const diffMs = now - createdAt;
            const m = Math.floor(diffMs / 60000);
            const h = Math.floor(diffMs / 3600000);
            const d = Math.floor(diffMs / 86400000);
            if (m < 1) return "Added just now";
            if (m < 60) return `Added ${m} min${m > 1 ? "s" : ""} ago`;
            if (h < 24) return `Added ${h} hour${h > 1 ? "s" : ""} ago`;
            if (d < 7) return `Added ${d} day${d > 1 ? "s" : ""} ago`;
            return `Added ${createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
        })()
        : "";

    return (
        <div
            className={cls(
                "rounded-lg border border-zinc-800 bg-zinc-950 p-3",
                task.isComplete && "opacity-60 line-through"
            )}
        >
            <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={!!task.isComplete} onChange={(e) => toggleDone(e.target.checked)} />
                <div className="flex-1">
                    {editing ? (
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <input
                                className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <input
                                type="date"
                                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                                value={due ? new Date(due).toISOString().slice(0, 10) : ""}
                                onChange={(e) => setDue(e.target.value ? new Date(e.target.value) : "")}
                            />
                            <button className="inline-flex items-center rounded-md bg-teal-400 px-3 py-1 text-sm text-zinc-900" onClick={save}>Save</button>
                            <button className="inline-flex items-center rounded-md border border-zinc-600 px-3 py-1 text-sm text-zinc-300" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <div className="text-zinc-100">{task.text}</div>
                            {human && <div className="text-xs italic text-zinc-400">{human}</div>}
                            {task.dueDate && (
                                <div className={cls("text-xs", todayClass(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate)))}>
                                    Due: {fmtDate(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate))}
                                </div>
                            )}
                        </>
                    )}


                    <Subtasks items={task.subtasks || []} onAdd={addSubtask} onToggle={toggleSub} onDelete={delSub} />
                </div>
                <div className="flex shrink-0 gap-1 self-start">
                    {!editing && (
                        <button className="inline-flex items-center rounded-md border border-zinc-600 px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-800" onClick={() => setEditing(true)}>Edit</button>
                    )}
                    <button className="inline-flex items-center rounded-md px-2 py-1 text-sm text-red-400 hover:bg-red-900/20" onClick={remove} title="Delete task">🗑️</button>
                </div>
            </div>
        </div>
    );
}