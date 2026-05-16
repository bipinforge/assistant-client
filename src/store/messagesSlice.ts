import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type MessageResponse = {
  messages: Message[];
  id: string;
  thread_id: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const fetchMessages = createAsyncThunk<MessageResponse, string>('messages/fetchMessages', async (threadId) => {
  const res = await fetch(`http://localhost:3000/messages/${threadId}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  const data = await res.json();
  
  if (!data.messages) {
    data.messages = [];
    data.thread_id = threadId;
  }
  return data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: { messages: [], id: '', thread_id: '' } as MessageResponse,
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
