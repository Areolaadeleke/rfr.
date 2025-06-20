import React, { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "./supabaseClient";
import Header from "./Header";
import Footer from "./Footer";

const CompanyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]); // Supabase event objects
  const [hoveredDate, setHoveredDate] = useState(null);
  const tooltipRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isBelow, setIsBelow] = useState(true);

  // Add Event form inputs
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventCategory, setNewEventCategory] = useState(""); // New category/tag input

  // Edit event states
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }
    }
    fetchEvents();
  }, []);

  // Tooltip positioning on mouse move
  useEffect(() => {
    if (!hoveredDate) {
      setShowTooltip(false);
      return;
    }
    const handleMouseMove = (e) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
      setIsBelow(window.innerHeight - e.clientY > tooltipHeight + 30);
      setShowTooltip(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredDate]);

  // Helper: map events by date string for quick lookup
  const eventsMap = events.reduce((acc, event) => {
    acc[event.event_date] = event.title;
    return acc;
  }, {});

  // Upcoming events (next 5)
  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= new Date()).slice(0, 5);

  // Birthdays/Anniversaries filtered by category or title keyword
  const birthdayAnniversaryEvents = events.filter(
    (e) =>
      e.category?.toLowerCase() === "birthday" ||
      e.category?.toLowerCase() === "anniversary" ||
      e.title.toLowerCase().includes("birthday") ||
      e.title.toLowerCase().includes("anniversary")
  );

  // Helper: validate date is today or future
  const isValidDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    const d = new Date(dateStr);
    return d >= today;
  };

  // Add Event form submit handler with date validation
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventDate || !newEventTitle) {
      alert("Please enter both date and event title");
      return;
    }
    if (!isValidDate(newEventDate)) {
      alert("Event date cannot be in the past");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert([{ event_date: newEventDate, title: newEventTitle, category: newEventCategory }])
      .select();

    if (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event");
    } else {
      setEvents((prev) => [...prev, ...data]);
      setNewEventDate("");
      setNewEventTitle("");
      setNewEventCategory("");
    }
  };

  // Handle saving edits with validation
  const handleSaveEdit = async () => {
    if (!editDate || !editTitle) {
      alert("Date and title are required");
      return;
    }
    if (!isValidDate(editDate)) {
      alert("Event date cannot be in the past");
      return;
    }

    const { error, data } = await supabase
      .from("events")
      .update({ title: editTitle, event_date: editDate, category: editCategory })
      .eq("id", editingEvent.id)
      .select();

    if (!error && data.length > 0) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingEvent.id ? data[0] : ev)));
      setEditingEvent(null);
      setShowDeleteConfirm(false);
    } else {
      alert("Error updating event");
    }
  };

  // Handle delete confirmed
  const handleDelete = async () => {
    const { error } = await supabase.from("events").delete().eq("id", editingEvent.id);
    if (!error) {
      setEvents((prev) => prev.filter((ev) => ev.id !== editingEvent.id));
      setEditingEvent(null);
      setShowDeleteConfirm(false);
    } else {
      alert("Error deleting event");
    }
  };

  return (
    <>
      <style>{`
        /* react-calendar overrides */
        .react-calendar {
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          width: 100%;
          max-width: 700px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        .react-calendar__navigation button {
          color: #3182ce;
          min-width: 44px;
          background: none;
          font-size: 16px;
          margin-top: 8px;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: #4a5568;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
        }
        .react-calendar__tile {
          max-width: initial !important;
          padding: 12px 6px;
          background: none;
          text-align: center;
          line-height: 1.2;
          font-size: 0.9rem;
          border-radius: 6px;
          transition: background-color 0.3s ease;
          position: relative;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #bee3f8;
          color: #2c5282;
          border-radius: 6px;
          cursor: pointer;
        }
        .highlight-event {
          background-color: #3182ce;
          color: white;
          font-weight: 700;
          border-radius: 8px;
          box-shadow: 0 0 6px #3182ceaa;
          position: relative;
        }
        .highlight-event:hover {
          background-color: #2c5282;
          box-shadow: 0 0 8px #2c5282cc;
        }
        .event-dot {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0 0 4px #3182ce;
        }
      `}</style>

      <header>
         <Header />
      </header>

      <div className="p-6 bg-white rounded shadow-md w-full max-w-4xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-6 pt-40">
        <section>
          <h2 className="text-3xl font-extrabold mb-6">📅 Company Calendar</h2>

          <Calendar
            onChange={setDate}
            value={date}
            tileClassName={({ date: tileDate }) => {
              const dateStr = tileDate.toISOString().split("T")[0];
              return eventsMap[dateStr] ? "highlight-event" : null;
            }}
            tileContent={({ date: tileDate }) => {
              const dateStr = tileDate.toISOString().split("T")[0];
              if (!eventsMap[dateStr]) return null;

              const event = events.find((e) => e.event_date === dateStr);

              return (
                <div
                  onClick={() => {
                    if (event) {
                      setEditingEvent(event);
                      setEditTitle(event.title);
                      setEditDate(event.event_date);
                      setEditCategory(event.category || "");
                      setShowDeleteConfirm(false);
                    }
                  }}
                  className="relative cursor-pointer h-full flex justify-center items-end pb-1"
                  aria-label={`Event: ${eventsMap[dateStr]}`}
                >
                  <span className="event-dot" />
                </div>
              );
            }}
            calendarType="gregory"
            className="w-full border border-gray-300 rounded-lg shadow-sm"
          />

          {hoveredDate && (
            <div
              ref={tooltipRef}
              style={{
                position: "fixed",
                top: isBelow
                  ? tooltipPos.y + 16
                  : tooltipPos.y - (tooltipRef.current?.offsetHeight + 16),
                left: tooltipPos.x,
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                userSelect: "none",
                opacity: showTooltip ? 1 : 0,
                transition: "opacity 0.25s ease, transform 0.25s ease",
                transformOrigin: "center top",
                ...(showTooltip
                  ? { transform: "translateX(-50%) translateY(0)" }
                  : {
                      transform: `translateX(-50%) translateY(${isBelow ? 6 : -6}px)`,
                    }),
              }}
            >
              {eventsMap[hoveredDate]}

              <div
                className="absolute left-1/2 -translate-x-1/2 transition-colors duration-300 ease-in-out"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: isBelow ? "none" : "7px solid #4B5563",
                  borderBottom: isBelow ? "7px solid #4B5563" : "none",
                  bottom: isBelow ? "100%" : "-7px",
                  top: isBelow ? "-7px" : "auto",
                }}
              />
            </div>
          )}

          <div className="mt-6 max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-sm text-center font-sans">
            <h3 className="text-xl font-extrabold mb-2 text-gray-800 tracking-wide">Selected Date:</h3>
            <p className="text-lg font-semibold text-gray-900 mb-3">{date.toDateString()}</p>
            <p className="text-md font-medium text-gray-700">
              {eventsMap[date.toISOString().split("T")[0]] || "No events"}
            </p>
          </div>

          {/* Add Event Form */}
            <form
            onSubmit={handleAddEvent}
            className="mt-6 w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-4"
            >
            <h3 className="text-xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
                ➕ Add New Event
            </h3>

            <label className="block">
                <span className="text-sm font-medium text-gray-700">📅 Date</span>
                <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </label>

            <label className="block">
                <span className="text-sm font-medium text-gray-700">📝 Title</span>
                <input
                type="text"
                placeholder="Event Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </label>

            <label className="block">
                <span className="text-sm font-medium text-gray-700">🏷️ Category</span>
                <input
                type="text"
                placeholder="e.g. Birthday, Meeting"
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </label>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
            >
                Add Event
            </button>
            </form>


        </section>

        <section className="space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-xl font-extrabold mb-4 text-blue-700 flex items-center gap-2">
            📅 Upcoming Events
        </h3>

        {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 italic">No upcoming events</p>
                ) : (
                    <ul className="space-y-2">
                    {upcomingEvents.map((ev) => (
                        <li
                        key={ev.id}
                        onClick={() => {
                            setEditingEvent(ev);
                            setEditTitle(ev.title);
                            setEditDate(ev.event_date);
                            setEditCategory(ev.category || "");
                            setShowDeleteConfirm(false);
                        }}
                        className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
                        >
                        <div className="text-base font-semibold text-blue-800">{ev.title}</div>
                        <div className="text-sm text-gray-600 flex flex-wrap items-center gap-1 mt-1">
                            <span>{new Date(ev.event_date).toDateString()}</span>
                            {ev.category && (
                            <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                {ev.category}
                            </span>
                            )}
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
                </div>


         <div className="bg-white rounded-lg shadow p-5">
  <h3 className="text-xl font-extrabold mb-4 text-pink-700 flex items-center gap-2">
    🎉 Birthdays & Anniversaries
  </h3>

  {birthdayAnniversaryEvents.length === 0 ? (
    <p className="text-gray-500 italic">No birthdays or anniversaries</p>
        ) : (
            <ul className="space-y-2">
            {birthdayAnniversaryEvents.map((ev) => (
                <li
                key={ev.id}
                onClick={() => {
                    setEditingEvent(ev);
                    setEditTitle(ev.title);
                    setEditDate(ev.event_date);
                    setEditCategory(ev.category || "");
                    setShowDeleteConfirm(false);
                }}
                className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-pink-200"
                >
                <div className="text-base font-semibold text-pink-800">{ev.title}</div>
                <div className="text-sm text-gray-600 flex flex-wrap items-center gap-1 mt-1">
                    <span>{new Date(ev.event_date).toDateString()}</span>
                    {ev.category && (
                    <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full text-xs font-medium">
                        {ev.category}
                    </span>
                    )}
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>

        </section>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-lg relative">
            <h3 className="text-xl font-bold">Edit Event</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Field */}
                <label className="block">
                    <span className="text-sm font-medium text-gray-700">📅 Date</span>
                    <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </label>

                {/* Title Field */}
                <label className="block">
                    <span className="text-sm font-medium text-gray-700">📝 Title</span>
                    <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Team Meeting"
                    />
                </label>

                {/* Category Field (full width on large screens) */}
                <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">🏷️ Category</span>
                    <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Birthday, Meeting"
                    />
                </label>
            </div>


            <div className="flex justify-between items-center pt-2">
             <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                Delete
             </button>


              <div>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setShowDeleteConfirm(false);
                  }}
                  className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-50 border border-red-400 rounded-lg text-red-800 shadow-md max-w-sm mx-auto">
                    <p className="text-center font-semibold mb-4">
                    Are you sure you want to delete this event?
                    </p>
                    <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 border border-red-400 rounded-lg text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                    >
                        Yes, Delete
                    </button>
                    </div>
                </div>
            )}

          </div>
        </div>
      )}

      <footer>
         <Footer />
      </footer>
    </>
  );
};

export default CompanyCalendar;
