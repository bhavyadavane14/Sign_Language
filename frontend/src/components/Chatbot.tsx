import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, RotateCcw, ArrowUpRight, Loader2 } from 'lucide-react';
import { chatbotService } from '../services/chatbotService';
import signxLogo from '../assets/signx_logo.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: string[];
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "How does real Indian Sign Language differ from ASL?",
  "What is the INCLUDE dataset by IIT Madras?",
  "Why is the ISL manual alphabet two-handed?",
  "How does the MediaPipe landmark pipeline work?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Namaste! I am the **SignX Assistant**, powered by Google Gemini and verified Indian Sign Language (ISL) resources. I can help you understand ISL grammar, explain our vision processing pipeline, or guide you on authentic signs from ISLRTC. What would you like to explore?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: 'bot',
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I am having trouble connecting to the backend Gemini service right now. Please verify `GEMINI_API_KEY` is configured in your `.env` file.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl border border-cream-300 shadow-card overflow-hidden">
      
      {/* Bot Chat Header with Official Logo */}
      <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-cream-300 p-1 flex items-center justify-center shadow-sm">
            <img 
              src={signxLogo} 
              alt="SignX Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-charcoal-900 text-base">SignX Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-forest-600 ring-2 ring-forest-100" />
            </div>
            <p className="text-xs text-charcoal-500">Google Gemini & Verified ISL Knowledge Base</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-forest-700 bg-forest-50 px-3 py-1.5 rounded-full border border-forest-200">
          <Sparkles className="w-3.5 h-3.5 text-coral-500" /> ISLRTC GROUNDED
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]/40">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-white border border-cream-300 p-1 flex items-center justify-center text-xs shrink-0 mt-1 shadow-sm">
                  <img 
                    src={signxLogo} 
                    alt="SignX Bot" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 text-sm leading-relaxed shadow-sm ${
                  isBot
                    ? 'bg-white border border-cream-300 text-charcoal-800'
                    : 'bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-br-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-cream-200 text-xs text-charcoal-500">
                    <span className="font-semibold text-charcoal-700">Verified Sources:</span>
                    <ul className="mt-1 space-y-0.5">
                      {msg.sources.map((src, i) => (
                        <li key={i} className="flex items-center gap-1 text-coral-600 truncate hover:underline">
                          <ArrowUpRight className="w-3 h-3 shrink-0" />
                          <a href={src} target="_blank" rel="noreferrer" className="truncate">{src}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={`text-[10px] mt-2 text-right ${isBot ? 'text-charcoal-400' : 'text-white/70'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-forest-700 text-white flex items-center justify-center text-xs shrink-0 mb-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-charcoal-500 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-coral-500" />
            <span>Generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2.5 border-t border-cream-200 bg-cream-50/60">
        <p className="text-[11px] font-semibold text-charcoal-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-coral-500" /> Suggested ISL Questions:
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-full text-xs bg-white border border-cream-300 text-charcoal-700 hover:border-coral-400 hover:text-coral-600 transition-all shrink-0 font-medium disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-cream-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Indian Sign Language..."
            className="flex-1 px-4 py-3 bg-cream-100 border border-cream-300 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 text-white flex items-center justify-center shadow-btn hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
