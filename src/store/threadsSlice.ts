import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Thread = {
  id: string;
  title: string;
};

export const fetchThreads = createAsyncThunk<Thread[]>('threads/fetchThreads', async () => {
  const res = await fetch('/api/threads');
  if (!res.ok) throw new Error('Failed to fetch threads');
  return res.json();
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [] as Thread[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load threads';
      });
  },
});

export default threadsSlice.reducer;