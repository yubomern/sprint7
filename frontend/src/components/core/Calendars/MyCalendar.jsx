import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import './Calendar.css'
const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const [events, setEvents] = useState([]);

  const { user } = useSelector((state) => state.profile);

  // Load events from backend
  useEffect(() => {
    console.log(user);
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Map backend event to react-big-calendar event shape
        const mappedEvents = data.map((ev) => ({
          id: ev._id,
          title: ev.name || ev.course || "No title",
          start: new Date(ev.start_date),
          end: new Date(ev.finish_date),
          allDay: false,
          resource: ev,
        }));
        setEvents(mappedEvents);
      })
      .catch(console.error);
  }, []);

  // Handle new event scheduling (for instructors only)
  const handleSelectSlot = ({ start, end }) => {
    if (user.accountType !== "Instructor") {
      alert("Only instructors can schedule events.");
      return;
    }

    const name = prompt("Enter event name", "New Scheduled Event");
    if (!name) return;

    // Prepare event data for backend
    const newEvent = {
      name,
      start_date: start,
      finish_date: end,
      CourseID: "default-course-id",
      course: "Default Course",
    };

    // POST event to backend
    fetch("http://localhost:4000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((savedEvent) => {
        setEvents((prev) => [
          ...prev,
          {
            id: savedEvent._id,
            title: savedEvent.name,
            start: new Date(savedEvent.start_date),
            end: new Date(savedEvent.finish_date),
            allDay: false,
            resource: savedEvent,
          },
        ]);
      })
      .catch(console.error);
  };

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        selectable={user.accountType === "Instructor"}
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
      />
    </div>
  );
}
