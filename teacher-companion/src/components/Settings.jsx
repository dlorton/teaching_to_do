import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Settings({ user }) {
    const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState("");
    const [loading, setLoading] = useState(true);

    // Load settings from Firestore
    useEffect(() => {
        if (!user) return;
        const loadSettings = async () => {
            try {
                const settingsRef = doc(db, "users", user.uid, "settings", "calendar");
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();
                    setGoogleSyncEnabled(data.googleSyncEnabled || false);
                    setSelectedCalendar(data.selectedCalendar || "");
                }
            } catch (err) {
                console.error("Error loading settings:", err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [user]);

    // Save settings to Firestore
    const saveSettings = async (newSyncEnabled, newCalendar) => {
        if (!user) return;
        try {
            const settingsRef = doc(db, "users", user.uid, "settings", "calendar");
            await setDoc(settingsRef, {
                googleSyncEnabled: newSyncEnabled,
                selectedCalendar: newCalendar,
                updatedAt: new Date()
            });
        } catch (err) {
            console.error("Error saving settings:", err);
        }
    };

    const handleGoogleSyncToggle = async (enabled) => {
        setGoogleSyncEnabled(enabled);
        await saveSettings(enabled, selectedCalendar);
        
        if (enabled) {
            alert("Google Calendar sync will be implemented in Phase 2. For now, use the built-in calendar!");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-zinc-400">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
                <p className="text-sm text-zinc-400">Manage your calendar and app preferences</p>
            </div>

            {/* Built-in Calendar Info */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-zinc-100">Built-in Calendar</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Your app includes a full-featured calendar for managing events, reminders, and task deadlines.
                        </p>
                        <ul className="mt-3 space-y-1 text-sm text-zinc-400">
                            <li>✓ Add, edit, and delete events</li>
                            <li>✓ Set reminders and notifications</li>
                            <li>✓ Push tasks from Todo lists to Calendar</li>
                            <li>✓ View daily, weekly, and monthly schedules</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Google Calendar Sync Toggle */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-zinc-100">🔄 Google Calendar Sync</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Optionally sync your built-in calendar with Google Calendar
                        </p>
                        <p className="mt-2 text-xs text-amber-500">
                            ⚠️ Coming in Phase 2 - Currently in development
                        </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={googleSyncEnabled}
                            onChange={(e) => handleGoogleSyncToggle(e.target.checked)}
                            className="peer sr-only"
                            disabled
                        />
                        <div className="peer h-6 w-11 rounded-full bg-zinc-700 opacity-50 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                </div>

                <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm text-zinc-400">
                    <p><strong>When enabled, you'll be able to:</strong></p>
                    <ul className="ml-4 list-disc space-y-1">
                        <li>Two-way sync between app calendar and Google Calendar</li>
                        <li>Choose which Google Calendar to sync with</li>
                        <li>See Google events in your app</li>
                        <li>Push app events to Google Calendar</li>
                    </ul>
                </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                <div className="flex gap-3">
                    <span className="text-xl">💡</span>
                    <div className="flex-1 text-sm text-zinc-300">
                        <p className="font-medium">Pro Tip:</p>
                        <p className="mt-1 text-zinc-400">
                            You can use the built-in calendar without connecting Google Calendar. 
                            The sync feature is completely optional for users who want to integrate 
                            with their existing Google Calendar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
