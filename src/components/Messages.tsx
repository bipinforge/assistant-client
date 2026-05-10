import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Messages = ({ msgs }: { msgs: Message[] }) => {
  return (
    <>
      {msgs.map((msg: Message, index) => (
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