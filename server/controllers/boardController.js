const Board = require('../models/Board');

exports.createBoard = async (req, res) => {
    try {
        const board = await Board.create({ title: req.body.title, owner: req.user.userId });
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create board', error: err.message });
    }
};

exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ owner: req.user.userId });
        res.status(200).json(boards);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch boards' });
    }
};

exports.deleteBoard = async (req, res) => {
    try {
        await Board.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
        res.status(200).json({ message: 'Board deleted', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete board' });
    }
};

exports.updateBoard = async (req, res) => {
    try {
        const board = await Board.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.userId },
            { title: req.body.title },
            { new: true }
        );
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json(board);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update board' });
    }
};