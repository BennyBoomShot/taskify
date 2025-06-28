import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBoard as createBoardAPI, deleteBoard as deleteBoardAPI } from '../../services/boardService';
import * as boardService from '../../services/boardService';

interface Board {
    _id: string;
    title: string;
    createdAt: string;
}

interface BoardState {
    items: Board[],
    loading: boolean,
    error: string | null,
};

const initialState: BoardState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchBoards = createAsyncThunk(
    'boards/fetchBoards',
    async (_NEVER, thunkAPI) => {
        try {
            const data = await boardService.fetchBoards();
            return data;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error loading boards');
        }
    }
);

export const createBoard = createAsyncThunk(
    'boards/createBoard',
    async (title: string, thunkAPI) => {
        try {
            const board = await createBoardAPI(title);
            return board;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Board creation failed');
        }
    }
);

export const deleteBoard = createAsyncThunk(
    'boards/deleteBoard',
    async (boardId: string, thunkAPI) => {
        try {
            const res = await deleteBoardAPI(boardId);
            return res.id;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Board deletion failed');
        }
    }
);

export const updateBoard = createAsyncThunk(
    'boards/updateBoard',
    async ({boardId, title}: {boardId: string, title: string}, thunkAPI) => {
        try {
            const board = await boardService.updateBoard(boardId, title);
            return board;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Board update failed');
        }
    }
);

const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.items = state.items.filter(board => board._id !== action.payload);
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const index = state.items.findIndex(board => board._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
})

export default boardsSlice.reducer;


