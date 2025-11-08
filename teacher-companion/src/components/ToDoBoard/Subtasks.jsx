import React, { useState } from "react";


const cls = (...c) => c.filter(Boolean).join(" ");


export default function Subtasks({ items, onAdd, onToggle, onDelete }) {
    const [v, setV] = useState("");
    const [open, setOpen] = useState(true);
    return (
        <div className="mt-2">
            <button className="mb-1 text-sm text-zinc-400 hover:text-teal-300" onClick={() => setOpen((o) => !o)}>
                {open ? "▼" : "▶"} {items.length ? `(${items.length})` : ""} Subtasks
            </button>
            {open && (
                <>
                    <ul className="ml-6 space-y-1">
                        {items.map((s, i) => (
                            <li key={i} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={!!s.isComplete} onChange={(e) => onToggle(i, e.target.checked)} />
                                    <span className={cls(s.isComplete && "line-through opacity-60")}>{s.text}</span>
                                </label>
                                <button className="px-2 text-red-400 hover:bg-red-900/20" onClick={() => onDelete(i)} title="Delete subtask">🗑️</button>
                            </li>
                        ))}
                    </ul>
                    <div className="ml-6 mt-2 flex gap-2">
                        <input
                            className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-teal-400"
                            placeholder="Add a subtask..."
                            value={v}
                            onChange={(e) => setV(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { onAdd(v); setV(""); } }}
                        />
                        <button className="inline-flex items-center rounded-md bg-teal-400 px-3 py-1 text-xs font-medium text-zinc-900 hover:opacity-90" onClick={() => { onAdd(v); setV(""); }}>+</button>
                    </div>
                </>
            )}
        </div>
    );
}