const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            createdBy: req.user.userId,
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task', error: err.message });
    }
};

exports.getTasksByBoard = async (req, res) => {
    try {
        const task = await Task.find({ board: req.query.boardId });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).json.end();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task' });
    }
};