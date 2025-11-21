import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { gapi } from "gapi-script";

export default function Settings({ user }) {
    const [syncEnabled, setSyncEnabled] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState("");
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Load settings from Firestore
    useEffect(() => {
        if (!user) return;
        const loadSettings = async () => {
            try {
                const settingsRef = doc(db, "users", user.uid, "settings", "calendar");
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();
                    setSyncEnabled(data.syncEnabled || false);
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
                syncEnabled: newSyncEnabled,
                selectedCalendar: newCalendar,
                updatedAt: new Date()
            });
        } catch (err) {
            console.error("Error saving settings:", err);
        }
    };

    // Request calendar access
    const requestCalendarAccess = async () => {
        try {
            // Initialize gapi client
            await gapi.load("client:auth2", async () => {
                await gapi.client.init({
                    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                    scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly"
                });

                // Sign in
                const authInstance = gapi.auth2.getAuthInstance();
                await authInstance.signIn();
                setIsAuthorized(true);

                // Load calendars
                await loadCalendars();
            });
        } catch (err) {
            console.error("Error requesting calendar access:", err);
            alert("Failed to connect to Google Calendar. Please try again.");
        }
    };

    // Load user's calendars
    const loadCalendars = async () => {
        try {
            const response = await gapi.client.calendar.calendarList.list();
            setCalendars(response.result.items || []);
        } catch (err) {
            console.error("Error loading calendars:", err);
        }
    };

    const handleSyncToggle = async (enabled) => {
        if (enabled && !isAuthorized) {
            await requestCalendarAccess();
        }
        setSyncEnabled(enabled);
        await saveSettings(enabled, selectedCalendar);
    };

    const handleCalendarChange = async (calendarId) => {
        setSelectedCalendar(calendarId);
        await saveSettings(syncEnabled, calendarId);
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
                <p className="text-sm text-zinc-400">Manage your calendar integration preferences</p>
            </div>

            {/* Calendar Sync Toggle */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-zinc-100">📅 Calendar Sync</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            Connect your Google Calendar to add tasks as events and view your schedule
                        </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={syncEnabled}
                            onChange={(e) => handleSyncToggle(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500"></div>
                    </label>
                </div>

                {syncEnabled && (
                    <div className="mt-4 space-y-4 border-t border-zinc-800 pt-4">
                        {/* Calendar Selection */}
                        {isAuthorized && calendars.length > 0 ? (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    Default Calendar
                                </label>
                                <select
                                    value={selectedCalendar}
                                    onChange={(e) => handleCalendarChange(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Select a calendar...</option>
                                    {calendars.map((cal) => (
                                        <option key={cal.id} value={cal.id}>
                                            {cal.summary} {cal.primary ? "(Primary)" : ""}
                                        </option>
                                    ))}
                                </select>
                                {selectedCalendar && (
                                    <p className="mt-2 text-xs text-zinc-400">
                                        Tasks will be added to: <span className="font-medium text-teal-400">
                                            {calendars.find(c => c.id === selectedCalendar)?.summary}
                                        </span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-zinc-400">
                                <p>Click "Connect Calendar" to authorize access to your Google Calendars</p>
                                <button
                                    onClick={requestCalendarAccess}
                                    className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                                >
                                    Connect Calendar
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                <div className="flex gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div className="flex-1 text-sm text-zinc-300">
                        <p className="font-medium">How Calendar Sync Works:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-400">
                            <li>Add tasks to your calendar with the "Add to Calendar" button</li>
                            <li>Choose all-day events or set specific times</li>
                            <li>View upcoming events in "Today's Schedule" widget</li>
                            <li>Tasks and calendar events stay separate - you control the sync</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
