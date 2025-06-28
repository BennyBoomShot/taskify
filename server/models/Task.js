const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    status: { type: String, default: 'To Do' },
    dueDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;