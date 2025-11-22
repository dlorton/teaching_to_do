import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "./lib/firebase";
import Sidebar from "./components/Sidebar";
import TodoBoard from "./components/ToDoBoard/ListName";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";


export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("todo");


  useEffect(() => onAuthStateChanged(auth, setUser), []);


  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl p-6">
          <header className="mb-6 border-b border-zinc-800 pb-4 text-center">
            <h1 className="text-2xl font-bold">My To-Do List</h1>
            <p className="text-zinc-400">Please sign in to continue</p>
          </header>
          <div className="flex justify-center">
            <button
              className="rounded-md bg-[#4285F4] px-4 py-2 text-white shadow hover:opacity-90"
              onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar user={user} active={active} setActive={setActive} />
      <main className="min-h-screen w-full md:pl-64">
        {active === "todo" && <TodoBoard user={user} />}
        {active === "calendar" && <Calendar user={user} />}
        {active === "settings" && <Settings user={user} />}
        {active !== "todo" && active !== "calendar" && active !== "settings" && (
          <div className="p-6">
            <div className="mx-auto max-w-5xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-2 text-xl font-semibold">Coming soon</h2>
              <p className="text-zinc-400">This section isn't ready yet.</p>
              <button className="mt-4 rounded-md bg-zinc-700 px-3 py-1 text-sm" onClick={() => setActive("todo")}>
                ← Back to Todo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}