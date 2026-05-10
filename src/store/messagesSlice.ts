import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const fetchMessages = createAsyncThunk<Message[]>('messages/fetchMessages', async () => {
  const res = await fetch('/api/messages');
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [] as Message[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load messages';
      });
  },
});

export default messagesSlice.reducer;