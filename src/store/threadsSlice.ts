import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Thread = {
  id: string;
  thread_id: string;
  name: string;
};

export const fetchThreads = createAsyncThunk<Thread[]>('threads/fetchThreads', async () => {
  const res = await fetch('http://localhost:3000/threads');
  if (!res.ok) throw new Error('Failed to fetch threads');
  const data = await res.json();
  return data.threads as Thread[];
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [] as Thread[],
    currentThreadId: null as string | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setCurrentThreadId: (state, action) => {
      state.currentThreadId = action.payload;
    }
  },
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
export const { setCurrentThreadId } = threadsSlice.actions;