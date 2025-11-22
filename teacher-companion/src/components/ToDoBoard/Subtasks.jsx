import React, { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";


const cls = (...c) => c.filter(Boolean).join(" ");


export default function Subtasks({ items, onAdd, onToggle, onDelete, onEdit, onReorder, isParentEditing }) {
    const [v, setV] = useState("");
    const [open, setOpen] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const listRef = useRef(null);
    const sortableRef = useRef(null);

    // Initialize Sortable for subtask reordering
    useEffect(() => {
        const el = listRef.current;
        if (!el || items.length === 0 || !onReorder) return;
        
        if (sortableRef.current) {
            try { sortableRef.current.destroy(); } catch { }
            sortableRef.current = null;
        }
        
        sortableRef.current = new Sortable(el, {
            animation: 150,
            ghostClass: "sortable-ghost",
            handle: ".drag-handle",
            delay: 100,
            delayOnTouchOnly: true,
            forceFallback: true,
            onEnd: (evt) => {
                if (evt.oldIndex !== evt.newIndex && onReorder) {
                    onReorder(evt.oldIndex, evt.newIndex);
                }
            },
        });
        
        return () => { 
            try { sortableRef.current?.destroy(); } catch { } 
            sortableRef.current = null; 
        };
    }, [items.length, onReorder]);

    const startEdit = (idx, text) => {
        setEditingIndex(idx);
        setEditText(text);
    };

    const saveEdit = (idx) => {
        if (editText.trim() && onEdit) {
            onEdit(idx, editText.trim());
        }
        setEditingIndex(null);
        setEditText("");
    };

    return (
        <div className="mt-2">
            <button className="mb-1 text-sm text-zinc-400 hover:text-teal-300" onClick={() => setOpen((o) => !o)}>
                {open ? "▼" : "▶"} {items.length ? `(${items.length})` : ""} Subtasks
            </button>
            {open && (
                <>
                    <ul ref={listRef} className="ml-6 space-y-1">
                        {items.map((s, i) => (
                            <li key={s.id || i} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-sm">
                                {items.length > 1 && (
                                    <span className="drag-handle cursor-move pr-1 text-zinc-500 hover:text-zinc-300" title="Drag to reorder">
                                        ⋮⋮
                                    </span>
                                )}
                                {isParentEditing && editingIndex === i ? (
                                    <div className="flex flex-1 items-center gap-2">
                                        <input
                                            className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 outline-none focus:border-teal-400"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(i);
                                                if (e.key === "Escape") { setEditingIndex(null); setEditText(""); }
                                            }}
                                            autoFocus
                                        />
                                        <button className="px-2 text-xs text-teal-400 hover:text-teal-300" onClick={() => saveEdit(i)}>✓</button>
                                        <button className="px-2 text-xs text-zinc-400 hover:text-zinc-300" onClick={() => { setEditingIndex(null); setEditText(""); }}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <label className="flex flex-1 items-center gap-2">
                                            <input type="checkbox" checked={!!s.isComplete} onChange={(e) => onToggle(i, e.target.checked)} />
                                            <span 
                                                className={cls(s.isComplete && "line-through opacity-60", isParentEditing && "cursor-pointer")}
                                                onClick={() => isParentEditing && startEdit(i, s.text)}
                                            >
                                                {s.text}
                                            </span>
                                        </label>
                                        {isParentEditing && (
                                            <button className="px-2 text-xs text-zinc-400 hover:text-teal-300" onClick={() => startEdit(i, s.text)} title="Edit subtask">✏️</button>
                                        )}
                                        <button className="px-2 text-red-400 hover:bg-red-900/20" onClick={() => onDelete(i)} title="Delete subtask">🗑️</button>
                                    </>
                                )}
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