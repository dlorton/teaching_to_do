import React, { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import {
    addDoc,
    collection,
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
    const [title, setTitle] = useState("My To-Do List");
    const [editingTitle, setEditingTitle] = useState(false);
    const [categories, setCategories] = useState([]);


    const catsRef = useMemo(() => (user ? collection(db, "users", user.uid, "categories") : null), [user]);


    useEffect(() => {
        if (!user) return;


        getDoc(doc(db, "users", user.uid)).then((snap) => {
            const d = snap.data();
            if (d?.title) setTitle(d.title);
        });


        const q = query(catsRef, orderBy("order", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setCategories(list);
        });
        return () => unsub();
    }, [user, catsRef]);

    // Sortable for categories (guarded)
    const listRef = useRef(null);
    const sortableRef = useRef(null);
    useEffect(() => {
        const el = listRef.current;
        if (!el || categories.length < 2) return;
        if (sortableRef.current) {
            try { sortableRef.current.destroy(); } catch { }
            sortableRef.current = null;
        }
        sortableRef.current = new Sortable(el, {
            animation: 150,
            ghostClass: "opacity-50 bg-zinc-700",
            onEnd: async () => {
                if (!user || !listRef.current) return;
                const children = Array.from(listRef.current.children);
                const batch = writeBatch(db);
                children.forEach((child, idx) => {
                    const id = child.getAttribute("data-id");
                    if (id) batch.update(doc(db, "users", user.uid, "categories", id), { order: idx });
                });
                await batch.commit();
            },
        });
        return () => { try { sortableRef.current?.destroy(); } catch { } sortableRef.current = null; };
    }, [user?.uid, categories.length]);

    const saveTitle = async (next) => {
        setTitle(next);
        setEditingTitle(false);
        if (!user) return;
        await setDoc(doc(db, "users", user.uid), { title: next }, { merge: true });
    };


    const addCategory = async (name) => {
        if (!name?.trim() || !user) return;
        const count = (await getDocs(catsRef)).size;
        await addDoc(catsRef, { name: name.trim(), order: count, createdAt: serverTimestamp() });
    };

    return (
        <div className="w-full px-4 py-6 md:px-6">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                {editingTitle ? (
                    <input
                        className="w-full max-w-xl rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-teal-400"
                        autoFocus
                        defaultValue={title}
                        onBlur={(e) => saveTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveTitle(e.currentTarget.value)}
                    />
                ) : (
                    <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
                )}
                <div className="flex items-center gap-2">
                    <button
                        className="inline-flex items-center rounded-md border border-zinc-600 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-800"
                        onClick={() => setEditingTitle((v) => !v)}
                    >
                        {editingTitle ? "Done" : "Edit Title"}
                    </button>
                    <button
                        className="inline-flex items-center rounded-md bg-zinc-700 px-3 py-1 text-sm text-zinc-100 hover:bg-zinc-600"
                        onClick={() => signOut(auth)}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <AddCategory onAdd={addCategory} />


            <div ref={listRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((c) => (
                    <div key={c.id} data-id={c.id} className="contents">
                        <CategoryCard user={user} cat={c} />
                    </div>
                ))}
            </div>
        </div>
    );
}