import React, { useState } from "react";


export default function AddTask({ onAdd }) {
    const [text, setText] = useState("");
    const [due, setDue] = useState("");
    return (
        <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
                className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                placeholder="Add a new task..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { onAdd(text, due); setText(""); setDue(""); } }}
            />
            <input
                type="date"
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                value={due}
                onChange={(e) => setDue(e.target.value)}
            />
            <button
                className="inline-flex items-center rounded-md bg-teal-400 px-4 py-2 text-sm font-medium text-zinc-900 hover:opacity-90"
                onClick={() => { onAdd(text, due); setText(""); setDue(""); }}
            >
                Add
            </button>
        </div>
    );
}