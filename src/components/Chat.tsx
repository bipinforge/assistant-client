// Chat.tsx
// React + TypeScript streaming chat UI for your API

import { useRef, useState } from "react";
import Messages from "./Messages";
import ChatHistory from "./ChatHistory";

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
        "http://localhost:3000/chat?thread_id=008",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            user_id: "008",
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
    <div className="flex h-screen w-screen font-sans bg-gray-900 text-white">
      {/* Sidebar */}

      <ChatHistory />

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6">
          <Messages/>
        </div>
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Ask anything..."
            className="flex-1 p-3.5 rounded-[10px] border border-gray-300"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 rounded-[10px] border-none cursor-pointer bg-blue-600 text-white disabled:opacity-50"
          >
            Send
          </button>
          {loading && (
            <button
              onClick={stopStreaming}
              className="px-5 rounded-[10px] border-none bg-red-600 text-white cursor-pointer"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;