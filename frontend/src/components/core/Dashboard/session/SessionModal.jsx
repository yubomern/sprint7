import React, { useEffect, useState } from "react";
import "./Sessions.css";
import { format, parseISO } from 'date-fns';
import axios from "axios";
import  './Sessions.css'
import {useSelector} from "react-redux";
export default function Sessions() {
    const [sessions, setSessions] = useState([]);
    const BASE_URL = 'http://localhost:4000';
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
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const  {token}  = useSelector(state => state.auth);

    const fetchCourses = () => {
        axios.get(`${BASE_URL}/api/v1/course/getAllCourses`)
            .then(res => {
                setCourses(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load courses');
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch all sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/sessions`);
                setSessions(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load sessions');
            }
        };
        fetchSessions();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return format(parseISO(dateStr), 'MMM dd, yyyy HH:mm');
        } catch {
            return "Invalid Date";
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        try {
            const payload = {
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            };

            const response = await axios.post(
                `${BASE_URL}/api/sessions`,
                payload,  // <-- this is your request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // attach token here
                        "Content-Type": "application/json"
                    }
                }
            );

            setSessions([...sessions, response.data]);
            setShowModal(false);
            setFormData({
                course: "",
                title: "",
                description: "",
                startTime: "",
                endTime: "",
                meetingId: "",
                meetingPassword: "",
                meetingUrl: ""
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create session');
        }
    };

    return (
        <div className="sessions-container">
            <h2>Sessions</h2>
            <button className="btn" onClick={() => setShowModal(true)}>➕ Add Session</button>

            {error && <div className="error-message">{error}</div>}

            {/* Session List */}
            <ul className="session-list">
                {sessions.map(s => (
                    <li key={s._id} className="session-card">
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <p>🕒 {formatDate(s.startTime)} → {formatDate(s.endTime)}</p>
                        {s.meetingUrl && (
                            <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="join-link">
                                🔗 Join Meeting
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
                        <h3>Create New Session</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="course">Course:</label>
                                <select
                                    id="course"
                                    value={formData.course}
                                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.courseName} (ID: {course._id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input
                                    id="title"
                                    placeholder="Session Title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    placeholder="Session Description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="startTime">Start Time:</label>
                                <input
                                    id="startTime"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endTime">End Time:</label>
                                <input
                                    id="endTime"
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                    min={formData.startTime}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="meetingUrl">Meeting URL:</label>
                                <input
                                    id="meetingUrl"
                                    placeholder="Zoom/Jitsi/Teams/Meet URL"
                                    value={formData.meetingUrl}
                                    onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="meetingId">Meeting ID:</label>
                                <input
                                    id="meetingId"
                                    placeholder="Meeting ID"
                                    value={formData.meetingId}
                                    onChange={e => setFormData({ ...formData, meetingId: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="meetingPassword">Meeting Password:</label>
                                <input
                                    id="meetingPassword"
                                    placeholder="Meeting Password"
                                    value={formData.meetingPassword}
                                    onChange={e => setFormData({ ...formData, meetingPassword: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn-submit">Save Session</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}