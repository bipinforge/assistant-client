import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchMessages, type Message } from '../store/messagesSlice';
import { useEffect } from 'react';

// type Message = {
//   role: "user" | "assistant";
//   content: string;
// };

const Messages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentThreadId } = useSelector((state: RootState) => state.threads);
  const { items } = useSelector((state: RootState) => state.messages);
  useEffect(() => {
    if (currentThreadId) {
      dispatch(fetchMessages(currentThreadId));
    }
  }, [dispatch, currentThreadId]);

  if (items.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img src="/favicon.svg" alt="No messages" className="w-64 h-64" />
      </div>
    );
  }
  return (
    <>
      {items.messages.map((msg: Message, index) => (
        <div
          key={index}
          className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
        >
          <div
            className={[
              "inline-block rounded-[12px] max-w-[80%] whitespace-pre-wrap",
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-black",
              "py-3 px-4"
            ].join(" ")}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
          </div>
        </div>
      ))}
    </>
  );
};

export default Messages;