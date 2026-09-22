import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: string[];
}

const SUGGESTED_PROMPTS = [
  "How does SIGNX translate ISL in real time?",
  "What 36 classes does the AI model support?",
  "How is Indian Sign Language different from ASL?",
  "How do I sign 'HELLO' and 'I LOVE YOU'?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Greetings! I am the SIGNX AI Copilot. I can guide you through Indian Sign Language (ISL), explain the MediaPipe computer vision pipeline, or help you practice gestures. What would you like to explore?', 
      sender: 'bot' 
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

  const handleSend = async (messageText: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(userMessage.text);
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.reply || response.response || 'I am processing your query.', 
        sender: 'bot',
        sources: response.sources
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Local fallback knowledge for common ISL queries
      let reply = "SIGNX utilizes 21 3D hand landmarks via MediaPipe and a deep CNN classifier to recognize Indian Sign Language letters (A-Z) and digits (0-9) at 30+ FPS directly in the browser.";
      const lower = textToSend.toLowerCase();
      if (lower.includes('classes') || lower.includes('support')) {
        reply = "The SIGNX model currently recognizes 36 core classes: 26 Alphabet letters (A-Z) and 10 Digits (0-9), along with key interactive phrases like 'HELLO' and 'I LOVE YOU'.";
      } else if (lower.includes('difference') || lower.includes('asl')) {
        reply = "Indian Sign Language (ISL) is native to South Asia and incorporates both one-handed and two-handed finger-spelling and grammar, whereas American Sign Language (ASL) primarily uses a one-handed manual alphabet.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] glass-card rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-2xl">
      
      {/* Bot Chat Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-surface-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center shadow-glow text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-white text-base">SIGNX AI Copilot</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
            <p className="text-xs text-white/50">Powered by Google Gemini & ISL Knowledge Engine</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 glass px-3 py-1 rounded-full border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" /> SEARCH GROUNDED
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-glow rounded-tr-none'
                  : 'glass border border-white/10 text-white/90 bg-white/5 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-[10px] text-white/40 uppercase font-mono">Sources:</span>
                  {msg.sources.map((s, idx) => (
                    <span key={idx} className="text-[11px] text-cyan-400 underline">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass px-4 py-3 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2 text-xs text-white/50">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" /> Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[11px] text-white/40 font-mono flex items-center gap-1 shrink-0">
          <HelpCircle className="w-3 h-3 text-accent-400" /> Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs text-white/60 hover:text-white glass px-3 py-1 rounded-full border border-white/10 hover:border-brand-500/40 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            {prompt} <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-4 border-t border-white/10 bg-surface-900/50 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Indian Sign Language, MediaPipe, or SIGNX..."
          className="flex-1 input-glass py-3 px-4 rounded-xl text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn-primary px-5 py-3 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
