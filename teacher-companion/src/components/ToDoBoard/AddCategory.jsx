import React, { useState } from "react";


export default function AddCategory({ onAdd }) {
    const [v, setV] = useState("");
    return (
        <div className="mb-6 flex flex-wrap items-center gap-2">
            <input
                className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                placeholder="Create a new category..."
                value={v}
                onChange={(e) => setV(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") { onAdd(v); setV(""); }
                }}
            />
            <button
                className="inline-flex items-center rounded-md bg-teal-400 px-4 py-2 text-sm font-medium text-zinc-900 hover:opacity-90"
                onClick={() => { onAdd(v); setV(""); }}
            >
                Add Category
            </button>
        </div>
    );
}