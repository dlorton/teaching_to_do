import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const EVENT_COLORS = [
    { name: "Teal", value: "teal", bg: "bg-teal-900/30", hover: "hover:bg-teal-900/50", text: "text-teal-300", border: "border-teal-600" },
    { name: "Blue", value: "blue", bg: "bg-blue-900/30", hover: "hover:bg-blue-900/50", text: "text-blue-300", border: "border-blue-600" },
    { name: "Purple", value: "purple", bg: "bg-purple-900/30", hover: "hover:bg-purple-900/50", text: "text-purple-300", border: "border-purple-600" },
    { name: "Pink", value: "pink", bg: "bg-pink-900/30", hover: "hover:bg-pink-900/50", text: "text-pink-300", border: "border-pink-600" },
    { name: "Orange", value: "orange", bg: "bg-orange-900/30", hover: "hover:bg-orange-900/50", text: "text-orange-300", border: "border-orange-600" },
    { name: "Green", value: "green", bg: "bg-green-900/30", hover: "hover:bg-green-900/50", text: "text-green-300", border: "border-green-600" },
];

export default function Calendar({ user }) {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, day
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        allDay: true,
        reminder: false,
        reminderMinutes: 15,
        color: "teal"
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

    const getDaysInWeek = (date) => {
        const days = [];
        const currentDay = new Date(date);
        const dayOfWeek = currentDay.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Go back to Sunday of this week
        const sunday = new Date(currentDay);
        sunday.setDate(currentDay.getDate() - dayOfWeek);
        
        // Generate 7 days (Sunday through Saturday)
        for (let i = 0; i < 7; i++) {
            const day = new Date(sunday);
            day.setDate(sunday.getDate() + i);
            days.push(day);
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

    const previousPeriod = () => {
        if (view === "month") {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else if (view === "week") {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(newDate);
        }
    };

    const nextPeriod = () => {
        if (view === "month") {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else if (view === "week") {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        }
    };

    const openAddModal = (clickedDate = null) => {
        const dateToUse = clickedDate || new Date();
        setSelectedDate(clickedDate);
        setFormData({
            title: "",
            description: "",
            date: dateToUse.toISOString().split('T')[0],
            startTime: "09:00",
            endTime: "10:00",
            allDay: true,
            reminder: false,
            reminderMinutes: 15,
            color: "teal"
        });
        setShowAddModal(true);
    };

    const openEditModal = (event, e) => {
        if (e) e.stopPropagation();
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
            reminderMinutes: event.reminderMinutes || 15,
            color: event.color || "teal"
        });
        setShowEditModal(true);
    };

    const getColorClasses = (colorValue) => {
        return EVENT_COLORS.find(c => c.value === colorValue) || EVENT_COLORS[0];
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date) return;

        try {
            // Create date in local timezone to avoid UTC offset issues
            const [year, month, day] = formData.date.split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
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
                color: formData.color,
                createdAt: Timestamp.now()
            });
            setShowAddModal(false);
            setSelectedDate(null);
        } catch (err) {
            console.error("Error adding event:", err);
            alert("Failed to add event");
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !selectedEvent) return;

        try {
            // Create date in local timezone to avoid UTC offset issues
            const [year, month, day] = formData.date.split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
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
                color: formData.color,
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

    const getViewTitle = () => {
        if (view === "day") {
            return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
        } else if (view === "week") {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${currentDate.getFullYear()}`;
        }
        return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    };

    return (
        <div className="h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">
                            {getViewTitle()}
                        </h1>
                        <p className="text-sm text-zinc-400">Manage your schedule and events</p>
                    </div>
                    <div className="flex gap-2">
                        {/* View Selector */}
                        <div className="flex rounded-md border border-zinc-700 bg-zinc-800">
                            <button
                                onClick={() => setView("day")}
                                className={`px-3 py-2 text-sm font-medium ${
                                    view === "day" ? "bg-teal-600 text-white" : "text-zinc-300 hover:bg-zinc-700"
                                } rounded-l-md`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setView("week")}
                                className={`border-x border-zinc-700 px-3 py-2 text-sm font-medium ${
                                    view === "week" ? "bg-teal-600 text-white" : "text-zinc-300 hover:bg-zinc-700"
                                }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setView("month")}
                                className={`px-3 py-2 text-sm font-medium ${
                                    view === "month" ? "bg-teal-600 text-white" : "text-zinc-300 hover:bg-zinc-700"
                                } rounded-r-md`}
                            >
                                Month
                            </button>
                        </div>
                        <button
                            onClick={() => openAddModal()}
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
                            onClick={previousPeriod}
                            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
                        >
                            ←
                        </button>
                        <button
                            onClick={nextPeriod}
                            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
                        >
                            →
                        </button>
                    </div>
                    <div className="text-sm text-zinc-400">
                        {events.length} event{events.length !== 1 ? 's' : ''} total
                    </div>
                </div>

                {/* Calendar Grid - Month View */}
                {view === "month" && (
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
                                        onClick={() => {
                                            if (day) {
                                                setCurrentDate(day);
                                                setView("day");
                                            }
                                        }}
                                        className={`min-h-[100px] cursor-pointer border-b border-r border-zinc-800 p-2 ${
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
                                                    {dayEvents.map(event => {
                                                        const colorClasses = getColorClasses(event.color);
                                                        return (
                                                            <div
                                                                key={event.id}
                                                                onClick={(e) => openEditModal(event, e)}
                                                                className={`cursor-pointer truncate rounded px-2 py-1 text-xs ${colorClasses.bg} ${colorClasses.hover} ${colorClasses.text}`}
                                                                title={event.title}
                                                            >
                                                                {event.allDay ? "" : "🕐 "}{event.title}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Week View */}
                {view === "week" && (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
                        <div className="grid grid-cols-7">
                            {getDaysInWeek(currentDate).map((day, index) => {
                                const dayEvents = getEventsForDate(day);
                                const isToday = day.toDateString() === new Date().toDateString();
                                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                
                                return (
                                    <div key={index} className="min-h-[400px] border-r border-zinc-800 last:border-r-0">
                                        <div className={`border-b border-zinc-800 p-3 text-center ${
                                            isToday ? 'bg-teal-900/20' : 'bg-zinc-800/50'
                                        }`}>
                                            <div className="text-xs font-medium text-zinc-400">{dayNames[index]}</div>
                                            <div className={`mt-1 text-lg font-bold ${
                                                isToday ? 'text-teal-400' : 'text-zinc-200'
                                            }`}>
                                                {day.getDate()}
                                            </div>
                                        </div>
                                        <div className="space-y-1 p-2">
                                            {dayEvents.map(event => {
                                                const colorClasses = getColorClasses(event.color);
                                                return (
                                                    <div
                                                        key={event.id}
                                                        onClick={() => openEditModal(event)}
                                                        className={`cursor-pointer rounded px-2 py-1 text-xs ${colorClasses.bg} ${colorClasses.hover} ${colorClasses.text}`}
                                                    >
                                                        <div className="truncate font-medium">{event.title}</div>
                                                        {!event.allDay && (
                                                            <div className="mt-0.5 text-[10px] opacity-80">{event.startTime}</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Day View */}
                {view === "day" && (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                        <div className="space-y-2">
                            {getEventsForDate(currentDate).map(event => {
                                const colorClasses = getColorClasses(event.color);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => openEditModal(event)}
                                        className={`cursor-pointer rounded-lg border-l-4 p-4 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hover}`}
                                    >
                                        <div className={`font-medium ${colorClasses.text}`}>{event.title}</div>
                                        {event.description && (
                                            <div className="mt-1 text-sm text-zinc-400">{event.description}</div>
                                        )}
                                        {!event.allDay && (
                                            <div className="mt-1 text-xs text-zinc-500">
                                                🕐 {event.startTime} - {event.endTime}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {getEventsForDate(currentDate).length === 0 && (
                                <div className="py-8 text-center text-zinc-400">
                                    No events for this day. Click "+ New Event" to add one.
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
                                <label className="mb-2 block text-sm font-medium text-zinc-300">Color</label>
                                <div className="flex gap-2">
                                    {EVENT_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData({...formData, color: color.value})}
                                            className={`h-8 w-8 rounded-full ${color.bg} ${
                                                formData.color === color.value ? `ring-2 ring-offset-2 ${color.border} ring-offset-zinc-900` : ''
                                            }`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
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
                                <label className="mb-2 block text-sm font-medium text-zinc-300">Color</label>
                                <div className="flex gap-2">
                                    {EVENT_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData({...formData, color: color.value})}
                                            className={`h-8 w-8 rounded-full ${color.bg} ${
                                                formData.color === color.value ? `ring-2 ring-offset-2 ${color.border} ring-offset-zinc-900` : ''
                                            }`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
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
