import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../../services/taskService';

interface Task {
    _id: string;
    title: string;
    description: string;
    boardId: string;
    createdBy: string;
    createdAt: string;
}

interface TaskState {
    itemsByBoard: Record<string, Task[]>;
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    itemsByBoard: {},
    loading: false,
    error: null,
};

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (task: {boardId: string, title: string, description: string}, thunkAPI) => {
        try {
            const data = await taskService.createTask(task.boardId, task.title, task.description);
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error creating task');
        }
    }
);

export const getTasksByBoard = createAsyncThunk(
    'tasks/getTasksByBoard',
    async (boardId: string, thunkAPI) => {
        try {
            const data = await taskService.getTasksByBoard(boardId);
            return {boardId, tasks: data};
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error getting tasks by board');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (task: {boardId: string, taskId: string, title: string}, thunkAPI) => {
        try {
            const data = await taskService.updateTask(task.boardId, task.taskId, task.title);
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error updating task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: string, thunkAPI) => {
        try {
            const data = await taskService.deleteTask(taskId);
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error deleting task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createTask.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createTask.fulfilled, (state, action) => {
            const {boardId, task} = action.payload;
            state.itemsByBoard[boardId] = [...(state.itemsByBoard[boardId] || []), task];
        })
        .addCase(createTask.rejected, (state, action) => {
            state.error = action.payload as string;
        })
        .addCase(getTasksByBoard.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getTasksByBoard.fulfilled, (state, action) => {
            const {boardId, tasks} = action.payload;
            state.itemsByBoard[boardId] = tasks;
        })
        .addCase(getTasksByBoard.rejected, (state, action) => {
            state.error = action.payload as string;
        })
        .addCase(updateTask.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            const {boardId, task} = action.payload;
            state.itemsByBoard[boardId] = state.itemsByBoard[boardId].map(t => t._id === task._id ? task : t);
        })
        .addCase(updateTask.rejected, (state, action) => {
            state.error = action.payload as string;
        })
        .addCase(deleteTask.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
            const {boardId, taskId} = action.payload;
            state.itemsByBoard[boardId] = state.itemsByBoard[boardId].filter(t => t._id !== taskId);
        })
        .addCase(deleteTask.rejected, (state, action) => {
            state.error = action.payload as string;
        })
    }
});

export default taskSlice.reducer;