import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchThreads, setCurrentThreadId, type Thread } from '../store/threadsSlice';
import { v4 as uuidv4 } from 'uuid';

const ChatHistory = ({clearStreamedMessages}: {clearStreamedMessages: () => void}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.threads);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const onThreadClick = (threadId: string) => {
    if(threadId === 'new-chat') {
      const newThreadId = `thread-${uuidv4()}`;
      dispatch(setCurrentThreadId(newThreadId));
      clearStreamedMessages();
    }else {
       dispatch(setCurrentThreadId(threadId));
    }
   
  };
  return (
    <div className="w-1/4 min-w-[220px] max-w-xs border-r border-gray-300 bg-gray-900 p-4 flex flex-col">
      <div className="space-y-2 flex-1 overflow-y-auto">
         <div className="p-3 bg-gray-500 rounded-lg shadow truncate" id="new-chat">
            <button onClick={() => onThreadClick('new-chat')} className="w-full text-left truncate">
              + New Chat
            </button>
          </div>
        {items && items.length > 0 && items.map((thread: Thread) => (
          <div className="p-3 bg-gray-800 rounded-lg shadow" id={thread.id} >
            <button onClick={() => onThreadClick(thread.thread_id)} className="w-full text-left truncate">
              {thread.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;