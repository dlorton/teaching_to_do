import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Calendar({ user }) {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, day
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        allDay: true,
        reminder: false,
        reminderMinutes: 15
    });

    // Load events from Firestore
    useEffect(() => {
        if (!user) return;
        const eventsRef = collection(db, "users", user.uid, "events");
        const q = query(eventsRef);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate() // Convert Firestore timestamp to Date
            }));
            setEvents(eventsData);
        });

        return () => unsubscribe();
    }, [user]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before the 1st
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const openAddModal = () => {
        setFormData({
            title: "",
            description: "",
            date: new Date().toISOString().split('T')[0],
            startTime: "09:00",
            endTime: "10:00",
            allDay: true,
            reminder: false,
            reminderMinutes: 15
        });
        setShowAddModal(true);
    };

    const openEditModal = (event) => {
        setSelectedEvent(event);
        const eventDate = new Date(event.date);
        setFormData({
            title: event.title,
            description: event.description || "",
            date: eventDate.toISOString().split('T')[0],
            startTime: event.startTime || "09:00",
            endTime: event.endTime || "10:00",
            allDay: event.allDay !== undefined ? event.allDay : true,
            reminder: event.reminder || false,
            reminderMinutes: event.reminderMinutes || 15
        });
        setShowEditModal(true);
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date) return;

        try {
            const eventDate = new Date(formData.date);
            const eventsRef = collection(db, "users", user.uid, "events");
            await addDoc(eventsRef, {
                title: formData.title,
                description: formData.description,
                date: Timestamp.fromDate(eventDate),
                startTime: formData.allDay ? null : formData.startTime,
                endTime: formData.allDay ? null : formData.endTime,
                allDay: formData.allDay,
                reminder: formData.reminder,
                reminderMinutes: formData.reminderMinutes,
                createdAt: Timestamp.now()
            });
            setShowAddModal(false);
        } catch (err) {
            console.error("Error adding event:", err);
            alert("Failed to add event");
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !selectedEvent) return;

        try {
            const eventDate = new Date(formData.date);
            const eventRef = doc(db, "users", user.uid, "events", selectedEvent.id);
            await updateDoc(eventRef, {
                title: formData.title,
                description: formData.description,
                date: Timestamp.fromDate(eventDate),
                startTime: formData.allDay ? null : formData.startTime,
                endTime: formData.allDay ? null : formData.endTime,
                allDay: formData.allDay,
                reminder: formData.reminder,
                reminderMinutes: formData.reminderMinutes,
                updatedAt: Timestamp.now()
            });
            setShowEditModal(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error("Error updating event:", err);
            alert("Failed to update event");
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent || !confirm("Are you sure you want to delete this event?")) return;

        try {
            const eventRef = doc(db, "users", user.uid, "events", selectedEvent.id);
            await deleteDoc(eventRef);
            setShowEditModal(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error("Error deleting event:", err);
            alert("Failed to delete event");
        }
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h1>
                        <p className="text-sm text-zinc-400">Manage your schedule and events</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={goToToday}
                            className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
                        >
                            Today
                        </button>
                        <button
                            onClick={openAddModal}
                            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                        >
                            + New Event
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={previousMonth}
                            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
                        >
                            ←
                        </button>
                        <button
                            onClick={nextMonth}
                            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
                        >
                            →
                        </button>
                    </div>
                    <div className="text-sm text-zinc-400">
                        {events.length} event{events.length !== 1 ? 's' : ''} total
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-800/50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-zinc-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7">
                        {days.map((day, index) => {
                            const dayEvents = day ? getEventsForDate(day) : [];
                            const isToday = day && day.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[100px] border-b border-r border-zinc-800 p-2 ${
                                        !day ? 'bg-zinc-900/50' : 'bg-zinc-900 hover:bg-zinc-800/50'
                                    }`}
                                >
                                    {day && (
                                        <>
                                            <div className={`mb-1 text-sm font-medium ${
                                                isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white' : 'text-zinc-300'
                                            }`}>
                                                {day.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        onClick={() => openEditModal(event)}
                                                        className="cursor-pointer truncate rounded bg-teal-900/30 px-2 py-1 text-xs text-teal-300 hover:bg-teal-900/50"
                                                        title={event.title}
                                                    >
                                                        {event.allDay ? "" : "🕐 "}{event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
                    <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-xl font-bold text-zinc-100">New Event</h2>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.allDay}
                                        onChange={(e) => setFormData({...formData, allDay: e.target.checked})}
                                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-teal-600"
                                    />
                                    <span className="text-sm text-zinc-300">All day event</span>
                                </label>
                            </div>
                            {!formData.allDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-300">Start Time</label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-300">End Time</label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.reminder}
                                        onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-teal-600"
                                    />
                                    <span className="text-sm text-zinc-300">Set reminder</span>
                                </label>
                            </div>
                            {formData.reminder && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-300">Remind me</label>
                                    <select
                                        value={formData.reminderMinutes}
                                        onChange={(e) => setFormData({...formData, reminderMinutes: parseInt(e.target.value)})}
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    >
                                        <option value="5">5 minutes before</option>
                                        <option value="15">15 minutes before</option>
                                        <option value="30">30 minutes before</option>
                                        <option value="60">1 hour before</option>
                                        <option value="1440">1 day before</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {showEditModal && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEditModal(false)}>
                    <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-4 text-xl font-bold text-zinc-100">Edit Event</h2>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-300">Date *</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.allDay}
                                        onChange={(e) => setFormData({...formData, allDay: e.target.checked})}
                                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-teal-600"
                                    />
                                    <span className="text-sm text-zinc-300">All day event</span>
                                </label>
                            </div>
                            {!formData.allDay && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-300">Start Time</label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-zinc-300">End Time</label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.reminder}
                                        onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-teal-600"
                                    />
                                    <span className="text-sm text-zinc-300">Set reminder</span>
                                </label>
                            </div>
                            {formData.reminder && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-300">Remind me</label>
                                    <select
                                        value={formData.reminderMinutes}
                                        onChange={(e) => setFormData({...formData, reminderMinutes: parseInt(e.target.value)})}
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-teal-500 focus:outline-none"
                                    >
                                        <option value="5">5 minutes before</option>
                                        <option value="15">15 minutes before</option>
                                        <option value="30">30 minutes before</option>
                                        <option value="60">1 hour before</option>
                                        <option value="1440">1 day before</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDeleteEvent}
                                    className="rounded-md border border-red-700 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/40"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
