const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Create a new session
router.post('/', asyncHandler(async (req, res) => {
    // Validate dates
    if (!req.body.startTime || !req.body.endTime) {
        throw new ErrorResponse('Start time and end time are required', 400);
    }

    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);

    if (isNaN(startTime.getTime())) {
        throw new ErrorResponse('Invalid start time', 400);
    }

    if (isNaN(endTime.getTime())) {
        throw new ErrorResponse('Invalid end time', 400);
    }

    if (endTime <= startTime) {
        throw new ErrorResponse('End time must be after start time', 400);
    }

    const session = new Session({
        ...req.body,
        startTime,
        endTime,
        instructor: req.user.id
    });

    await session.save();
    res.status(201).json(session);
}));

// Get all sessions
router.get('/', asyncHandler(async (req, res) => {
    const sessions = await Session.find()
        .populate('course participants instructor')
        .sort({ startTime: 1 });
    res.json(sessions);
}));

// Get single session by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)
        .populate('course participants instructor');
    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }
    res.json(session);
}));

// Update session
router.put('/:id', asyncHandler(async (req, res) => {
    const updates = { ...req.body };

    // Handle date updates
    if (req.body.startTime) {
        updates.startTime = new Date(req.body.startTime);
        if (isNaN(updates.startTime.getTime())) {
            throw new ErrorResponse('Invalid start time', 400);
        }
    }

    if (req.body.endTime) {
        updates.endTime = new Date(req.body.endTime);
        if (isNaN(updates.endTime.getTime())) {
            throw new ErrorResponse('Invalid end time', 400);
        }
    }

    const session = await Session.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    });

    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }

    res.json(session);
}));

// Delete session
router.delete('/:id', asyncHandler(async (req, res) => {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
        throw new ErrorResponse('Session not found', 404);
    }
    res.json({ success: true, data: {} });
}));

module.exports = router;