import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, User, Sparkles, MessageSquare, 
  RotateCcw, ExternalLink, Loader2, ArrowUpRight 
} from 'lucide-react';
import { chatbotService } from '../services/chatbotService';
import signxLogo from '../assets/signx_logo.png';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  sources?: string[];
  timestamp: string;
}

interface SignXAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "How does real ISL differ from ASL?",
  "What is the INCLUDE dataset?",
  "How is 'Hello / Namaste' signed in ISL?",
  "Why does ISL use a 2-handed manual alphabet?",
];

export default function SignXAssistantDrawer({ isOpen, onClose }: SignXAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Namaste! I am the **SignX Assistant**, powered by Google Gemini and verified Indian Sign Language (ISL) resources. I can answer questions about ISL grammar, explain our computer vision architecture, or guide you through authentic signs. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I am having trouble connecting to the backend Gemini service right now. Please ensure your `GEMINI_API_KEY` is configured in `.env`, or explore our verified educational signs under the Learn section.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: "Conversation reset. What would you like to know about Indian Sign Language?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-cream-100 h-full shadow-2xl flex flex-col z-10 border-l border-cream-300">
        
        {/* Drawer Header with Official Logo */}
        <div className="p-4 sm:p-5 bg-white border-b border-cream-200 flex items-center justify-between">
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
                <span className="w-2 h-2 rounded-full bg-forest-500 ring-2 ring-forest-100" />
              </div>
              <p className="text-xs text-charcoal-500">Google Gemini & ISL Knowledge Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="w-9 h-9 rounded-xl text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 flex items-center justify-center transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close assistant"
              className="w-9 h-9 rounded-xl text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
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

                  {/* Sources citation if available */}
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
                  <div className="w-7 h-7 rounded-lg bg-forest-700 text-white flex items-center justify-center text-xs shrink-0 mb-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-charcoal-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-coral-500" />
              <span>SignX Assistant is generating an ISL-grounded response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested ISL Questions */}
        <div className="px-4 py-2 border-t border-cream-200 bg-cream-50/70">
          <p className="text-[11px] font-semibold text-charcoal-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-coral-500" /> Suggested ISL Topics:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full text-xs bg-white border border-cream-300 text-charcoal-700 hover:border-coral-400 hover:text-coral-600 transition-all shrink-0 font-medium disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-cream-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian Sign Language..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 text-white flex items-center justify-center shadow-btn hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
