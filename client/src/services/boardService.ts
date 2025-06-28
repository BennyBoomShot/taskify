import api from './api';

export const fetchBoards = async () => {
    const res = await api.get('/boards');
    return res.data;
};

export const createBoard = async (title: string) => {
    const res = await api.post('/boards', { title});
    return res.data;
};

export const deleteBoard = async (boardId: string) => {
    const res = await api.delete(`/boards/${boardId}`);
    return res.data;
};

export const updateBoard = async (boardId: string, title: string) => {
    const res = await api.put(`/boards/${boardId}`, { title });
    return res.data;
};