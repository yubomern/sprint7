import React, { useEffect, useState } from "react";

export default function SessionsV1() {
    const [sessions, setSessions] = useState([]);
    const [formData, setFormData] = useState({
        course: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        meetingId: "",
        meetingPassword: "",
        meetingUrl: ""
    });

    useEffect(() => {
        fetch("http://localhost:4000/api/sessions")
            .then(res => res.json())
            .then(data => setSessions(data));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await fetch("http://localhost:4000/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        setSessions([...sessions, data]);
    };

    return (
        <div>
            <h2>Sessions</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Course ID"
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    required
                />
                <input
                    placeholder="Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    required
                />
                <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    required
                />
                <input
                    placeholder="Meeting URL"
                    value={formData.meetingUrl}
                    onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                />
                <button type="submit">Add Session</button>
            </form>

            <ul>
                {sessions.map(s => (
                    <li key={s._id}>
                        <b>{s.title}</b> ({new Date(s.startTime).toLocaleString()})
                        <br />
                        <a href={s.meetingUrl} target="_blank" rel="noreferrer">
                            Join Meeting
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
