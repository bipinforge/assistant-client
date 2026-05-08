// Chat.tsx
// React + TypeScript streaming chat UI for your API

import { useRef, useState } from "react";
import Messages from "./Messages";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);

    setLoading(true);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(
        "http://localhost:3000/chat?thread_id=004",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            user_id: "004",
            model_name: "openai:gpt-4o-mini",
            user_message: input,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      setInput("");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let finalText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        console.log("RAW CHUNK:", chunk);

        // -----------------------------------
        // If backend returns plain text chunks
        // -----------------------------------

        finalText += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: finalText,
          };

          return updated;
        });

        // -----------------------------------
        // If backend returns JSON/SSE chunks
        // then parse here instead
        // -----------------------------------
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Streaming failed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "700px",
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <h2>Streaming AI Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 20,
          height: 500,
          overflowY: "auto",
          marginBottom: 20,
        }}
      >
        <Messages msgs={messages} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "0 20px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>

        {loading && (
          <button
            onClick={stopStreaming}
            style={{
              padding: "0 20px",
              borderRadius: 10,
              border: "none",
              background: "red",
              color: "white",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;