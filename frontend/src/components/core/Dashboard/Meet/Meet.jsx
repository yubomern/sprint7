import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

export default function Meet() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: "",
        meet_link: "",
        course_image: "",
        start: "",
        end: ""
    });

    const { user } = useSelector((state) => state.profile);

    // Fetch events from backend
    useEffect(() => {
        fetch("http://localhost:4000/api/v1/meet")
            .then((res) => res.json())
            .then((data) => {
                const mapped = data.map((ev) => ({
                    id: ev._id,
                    title: ev.name,
                    start: new Date(ev.start_date),
                    end: new Date(ev.finish_date),
                    allDay: false,
                    resource: ev
                }));
                setEvents(mapped);
            })
            .catch(console.error);
    }, []);

    // When user selects a slot
    const handleSelectSlot = ({ start, end }) => {
        if (user.accountType !== "Instructor") {
            alert("Only instructors can schedule events.");
            return;
        }
        setNewEvent({ ...newEvent, start, end });
        setShowModal(true);
    };

    // Save event to backend
    const handleSaveEvent = (e) => {
        e.preventDefault();
        const eventData = {
            name: newEvent.name,
            start_date: newEvent.start,
            finish_date: newEvent.end,
            CourseID: "default-course-id",
            course: "Default Course",
            meet_link: newEvent.meet_link,
            course_image: newEvent.course_image
        };

        fetch("http://localhost:4000/api/v1/meet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
        })
            .then((res) => res.json())
            .then((saved) => {
                setEvents((prev) => [
                    ...prev,
                    {
                        id: saved._id,
                        title: saved.name,
                        start: new Date(saved.start_date),
                        end: new Date(saved.finish_date),
                        allDay: false,
                        resource: saved
                    }
                ]);
                setShowModal(false);
                setNewEvent({ name: "", meet_link: "", course_image: "", start: "", end: "" });
            })
            .catch(console.error);
    };

    // Custom event display
    const EventComponent = ({ event }) => (
        <div>
            <strong>{event.title}</strong>
            {event.resource?.course_image && (
                <img
                    src={event.resource.course_image}
                    alt="course"
                    style={{ width: "40%", height: "auto", marginTop: 5 }}
                />
            )}
            {event.resource?.meet_link && (
                <div>
                    <a href={event.resource.meet_link} target="_blank" rel="noreferrer">
                        Join Meeting
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ height: 600 }}>
            <Calendar
                localizer={localizer}
                events={events}
                components={{ event: EventComponent }}
                defaultView="week"
                selectable={user.accountType === "Instructor"}
                onSelectSlot={handleSelectSlot}
                style={{ height: 600 }}
            />

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay ">
                    <div className="modal">
                        <h2>Schedule Event</h2>
                        <form onSubmit={handleSaveEvent}>
                            <label>Event Name:</label>
                            <input
                                type="text"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                required
                            />
                            <label>Meeting Link:</label>
                            <input
                                type="url"
                                value={newEvent.meet_link}
                                onChange={(e) => setNewEvent({ ...newEvent, meet_link: e.target.value })}
                                placeholder="https://meet.google.com/..."
                            />
                            <label>Course Image URL:</label>
                            <input
                                type="url"
                                value={newEvent.course_image}
                                onChange={(e) => setNewEvent({ ...newEvent, course_image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
