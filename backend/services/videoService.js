const axios = require('axios');

// For Zoom integration
const createZoomMeeting = async (topic, startTime, duration, userId, zoomToken) => {
    try {
        const response = await axios.post(
            `https://api.zoom.us/v2/users/${userId}/meetings`,
            {
                topic,
                type: 2, // Scheduled meeting
                start_time: startTime,
                duration,
                timezone: 'UTC',
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${zoomToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        throw error;
    }
};

// For Jitsi integration (simpler as it doesn't require API calls)
const generateJitsiLink = (courseId, sessionId) => {
    const roomName = `lms-${courseId}-${sessionId}`;
    return `https://meet.jit.si/${roomName}`;
};

module.exports = {
    createZoomMeeting,
    generateJitsiLink
};