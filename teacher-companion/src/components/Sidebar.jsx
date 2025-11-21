import React, { useState } from "react";


const cls = (...c) => c.filter(Boolean).join(" ");


export default function Sidebar({ user, active, setActive }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <nav
                className={cls(
                    "fixed left-0 top-0 z-50 h-screen w-64 border-r border-zinc-800 bg-zinc-900 transition-transform",
                    open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex items-center justify-between border-b border-zinc-800 p-4">
                    <h2 className="text-lg font-bold text-teal-300">Teacher Companion</h2>
                    <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
                        ☰
                    </button>
                </div>
                <ul className="flex-1 overflow-y-auto">
                    {[
                        { key: "todo", label: "Todo List", icon: "📋", disabled: false },
                        { key: "calendar", label: "Calendar", icon: "📅", disabled: true },
                        { key: "supplies", label: "Supplies", icon: "🛒", disabled: true },
                        { key: "resources", label: "Resources", icon: "📚", disabled: true },
                        { key: "lessons", label: "Lessons", icon: "📖", disabled: true },
                    ].map((item) => (
                        <li
                            key={item.key}
                            className={cls(
                                "flex cursor-pointer items-center gap-3 px-4 py-3 text-zinc-400",
                                !item.disabled && "hover:bg-teal-900/10 hover:text-teal-300",
                                active === item.key && "border-l-4 border-teal-400 bg-teal-900/20 text-teal-300",
                                item.disabled && "cursor-not-allowed opacity-40"
                            )}
                            onClick={() => !item.disabled && setActive(item.key)}
                        >
                            <span className="w-6 text-xl">{item.icon}</span>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.disabled && (
                                <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px]">Soon</span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="border-t border-zinc-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-xl">👤</div>
                        <div className="truncate">
                            <div className="truncate text-sm font-medium text-zinc-200">{user?.displayName || "Loading..."}</div>
                            <div className="truncate text-xs text-zinc-400">{user?.email || ""}</div>
                        </div>
                    </div>
                </div>
            </nav>
            <button
                className="fixed right-3 top-3 z-50 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-200 md:hidden"
                onClick={() => setOpen((v) => !v)}
            >
                ☰
            </button>


            {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
        </>
    );
}