import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bot, User, Send, Sparkles, ArrowLeft, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { streamChatResponse } from "../services/chatApi";
import { useDashboard } from "../services/dashboardApi";

const PREDEFINED_QUESTIONS = [
  { text: "Where did I overspend?", icon: "📉" },
  { text: "Monthly budget summary", icon: "📊" },
  { text: "How to save ₹5000?", icon: "💡" },
  { text: "My top 3 categories", icon: "🏆" },
];

export function ChatPage() {
  const navigate = useNavigate();
  const selectedMonth = useSelector((state) => state.app.selectedMonth);
  const { data: dashboardData } = useDashboard(selectedMonth);
  const { categoryPlanUsage } = dashboardData || {};

  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm your FinPal AI assistant. How can I help you with your finances today?" }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamAIMessage = async (query) => {
    if (!query.trim()) return;

    const userMsg = { from: "user", text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    let aiText = "";
    const aiMsgSlot = { from: "ai", text: "" };
    setMessages(prev => [...prev, aiMsgSlot]);

    try {
      const generator = streamChatResponse(query, categoryPlanUsage, token);
      for await (const chunk of generator) {
        aiText += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { from: "ai", text: aiText };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "ai", text: "I'm sorry, I encountered an error. Please try again." };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = () => {
    if (isStreaming) return;
    streamAIMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">FinPal AI</h1>
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Always Online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-0 py-8 scroll-smooth no-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-4 sm:gap-6 animate-fade-in ${msg.from === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${msg.from === "user" ? "bg-gray-100 dark:bg-gray-800" : "bg-primary-500 text-white"
                }`}>
                {msg.from === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] ${msg.from === "user" ? "items-end" : ""}`}>
                <div className={`px-5 py-4 rounded-3xl text-sm sm:text-base leading-relaxed ${msg.from === "user"
                    ? "bg-gray-900 text-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800"
                  }`}>
                  <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base font-medium">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  {msg.from === "ai" && isStreaming && i === messages.length - 1 && (
                    <span className="ml-1 inline-block w-1.5 h-5 bg-primary-500 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {PREDEFINED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => streamAIMessage(q.text)}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 hover:bg-primary-50/10 transition-all text-left text-sm font-bold text-gray-600 dark:text-gray-400 group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 sticky bottom-0">
        <div className="max-w-3xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about your budget..."
            className="w-full h-14 sm:h-16 pl-6 pr-16 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none font-bold text-gray-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-gray-400 font-bold uppercase tracking-widest">
          This is informational only, not financial advice.
        </p>
      </footer>
    </div>
  );
}
