// features/dashboard/ChatWidget.js
import { BotMessageSquare, X } from "lucide-react";
import React, { useState, useRef } from "react";
import { streamChatResponse } from "../../../services/chatApi";
import ReactMarkdown from "react-markdown";

const PREDEFINED_PILLS = [
  "Where did I overspend this month?",
  "Which category should I reduce?",
  "Summarize my savings this month",
  "What’s my spending trend?",
  "How much did I spend category-wise?",
  "How to improve my budget?",
];

export default function ChatWidget({ categoryPlanUsage }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { from: 'user' | 'ai', text }
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  const token = localStorage.getItem("auth-token");

  const addMessage = (msg) => {
    setMessages((m) => [...m, msg]);
    setTimeout(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 10);
  };

  const streamAIMessage = async (query) => {
    addMessage({ from: "user", text: query });
    setInput("");
    setIsStreaming(true);

    // slot for AI response
    let aiText = "";
    addMessage({ from: "ai", text: "" });

    try {
      const generator = streamChatResponse(query, categoryPlanUsage, token);

      for await (const chunk of generator) {
        aiText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { from: "ai", text: aiText };
          return updated;
        });

        if (scrollRef.current)
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Something went wrong." },
      ]);
    }

    setIsStreaming(false);
  };

  const onSend = () => {
    if (!input.trim()) return;
    streamAIMessage(input.trim());
  };

  const onPillClick = (pill) => {
    streamAIMessage(pill);
  };

  return (
    <div
      className={`fixed z-50 ${
        open ? "bottom-0 right-0" : "bottom-8 right-24"
      }`}
    >
      {open && (
        <div className="md:w-[360px] md:h-[520px] w-screen h-screen bg-white dark:bg-gray-950 shadow-xl rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between">
            <span className="font-semibold dark:text-white">
              Finpal Assistant
            </span>
            <button className="dark:text-white" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Pills */}
          <div className="px-3 py-2 border-b dark:border-gray-800">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {PREDEFINED_PILLS.map((pill) => (
                <button
                  key={pill}
                  onClick={() => onPillClick(pill)}
                  className="border whitespace-nowrap px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-950 hover:opacity-90 dark:text-white"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto px-3 py-4 space-y-3 bg-gray-50 dark:bg-gray-950"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.from === "user"
                      ? "bg-indigo-600 text-white border"
                      : "bg-white dark:bg-gray-950 text-gray-900 dark:text-white border"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.from === "ai" &&
                    isStreaming &&
                    index === messages.length - 1 && (
                      <span className="ml-1 animate-pulse">▍</span>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-gray-800 flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none"
              placeholder="Ask about your budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
            />
            <button
              disabled={isStreaming}
              onClick={onSend}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
            >
              {isStreaming ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-4 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <BotMessageSquare size={20} />
        </button>
      )}
    </div>
  );
}
