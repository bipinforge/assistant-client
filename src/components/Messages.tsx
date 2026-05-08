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
          style={{
            textAlign: msg.role === "user" ? "right" : "left",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "12px 16px",
              borderRadius: 12,
              background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "black",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
            }}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
          </div>
        </div>
      ))}
    </>
  );
};

export default Messages;