import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice';
import threadsReducer from './threadsSlice';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    threads: threadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;