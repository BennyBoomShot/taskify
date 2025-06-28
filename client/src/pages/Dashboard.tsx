import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../features/board/boardSlice';
import { createTask, getTasksByBoard } from '../services/taskService';


const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user, token } = useSelector((state: RootState) => state.auth);

    const { items: boards, loading, error } = useSelector((state: RootState) => state.boards);

    const [title, setTitle] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [tasks, setTasks] = useState<Record<string, any[]>>({});
    const [openBoardId, setOpenBoardId] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchBoards());
        }
    }, [dispatch, token]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleCreateBoard = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            dispatch(createBoard(title));
            setTitle('');
        }
    };

    const handleUpdateBoard = (boardId: string) => {
        if (editTitle.trim()) {
            dispatch(updateBoard({ boardId, title: editTitle }));
            setEditingId(null);
        }
    };

    const handleDeleteBoard = (boardId: string) => {
        dispatch(deleteBoard(boardId));
    };

    const handleToggleBoard = async (boardId: string) => {
        setOpenBoardId(prev => (prev === boardId ? null : boardId));
        if (!tasks[boardId]) {
            const boardTasks = await getTasksByBoard(boardId);
            setTasks(prev => ({ ...prev, [boardId]: [boardTasks] }));
        }
    };

    const handleCreateTask = async (boardId: string) => {
        if (newTaskTitle.trim()) {
            const task = await createTask(boardId, newTaskTitle, '');
            setTasks(prev => ({ ...prev, [boardId]: [...(prev[boardId] || []), task] }));
            setNewTaskTitle('');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* opening div */}
            <div style={{ marginBottom: '1rem' }}>
                {/* Login/Logout button div */}
                {token ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <Link to="/login"><button>Login</button></Link>
                )}
            </div>
            {/* Header div */}
            <h1>Welcome to Taskify</h1>
            {token ? (
                <div>
                    <p>Welcome, {user?.name || 'please sign in'}!</p>
                    <form onSubmit={handleCreateBoard}>
                        <input
                            type="text"
                            placeholder="Board Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button type="submit">Create Board</button>
                    </form>
                    {loading && <p>Loading boards...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {boards.length > 0 ? (
                        <ul>
                            {boards.map(board => (
                                <li key={board._id} style={{ marginBottom: '1rem' }}>
                                    {editingId === board._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateBoard(board._id)}>Save</button>
                                            <button onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <strong onClick={() => handleToggleBoard(board._id)} style={{ cursor: 'pointer' }}>{board.title}</strong>
                                            {openBoardId === board._id && (
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="New Task"
                                                        value={newTaskTitle}
                                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                                    />
                                                    <button onClick={() => handleCreateTask(board._id)}>Add Task</button>
                                                    <ul>
                                                        {tasks[board._id]?.map(task => (
                                                            <li key={task._id}>
                                                                {task.title}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <button onClick={() => handleDeleteBoard(board._id)}>Delete</button>
                                            <button onClick={() => {
                                                setEditingId(board._id);
                                                setEditTitle(board.title);
                                            }}>Edit</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p>You have no boards yet.</p>
                    )}
                </div>
            ) : (
                <div>
                    <p>Please login to view your boards.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;