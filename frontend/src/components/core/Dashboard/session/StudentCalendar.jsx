import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function StudentCalendar({ userId }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/sessions/student/${userId}`)
            .then(res => res.json())
            .then(data => {
                // Convert sessions to calendar events
                const events = data.map(s => ({
                    id: s._id,
                    title: s.title,
                    start: parseISO(s.startTime),
                    end: parseISO(s.endTime),
                    meetingUrl: s.meetingUrl
                }));
                setSessions(events);
            });
    }, [userId]);

    const handleSelectEvent = (event) => {
        if (event.meetingUrl) {
            window.open(event.meetingUrl, "_blank");
        }
    };

    return (
        <div style={{ height: "80vh", padding: "20px" }}>
            <h2>📅 My Sessions</h2>
            <Calendar
                localizer={localizer}
                events={sessions}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
}
