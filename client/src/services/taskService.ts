import api from './api';

export const createTask = async (boardId: string, title: string, description: string) => {
    const res = await api.post(`/boards/${boardId}/tasks`, { title, description });
    return res.data;
};

export const getTasksByBoard = async (boardId: string) => {
    const res = await api.get(`/boards/${boardId}/tasks`);
    return res.data;
};

export const updateTask = async (taskId: string, title: string, description: string) => {
    const res = await api.put(`/tasks/${taskId}`, { title, description });
    return res.data;
};

export const deleteTask = async (taskId: string) => {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.data;
};