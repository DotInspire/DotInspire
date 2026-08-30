import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send 
} from 'lucide-react';
import { api } from '../../services/api';
import logo from '../../assets/logo.png';
import type { WebsiteSettings } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatbotProps {
  settings?: WebsiteSettings | null;
}

// Clean static & smooth animated chat messages
const AssistantMessageContent: React.FC<{ content: string; isLatest: boolean }> = ({ content, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(isLatest ? '' : content);
  const [isTyping, setIsTyping] = useState(isLatest);
  const typingRef = useRef(false);

  useEffect(() => {
    // If it's already rendered or not the latest, display immediately
    if (!isLatest || typingRef.current) {
      setDisplayedText(content);
      setIsTyping(false);
      return;
    }

    typingRef.current = true;
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      index += 2; // Fast, smooth cyber stream
      if (index <= content.length) {
        setDisplayedText(content.slice(0, index));
      } else {
        setDisplayedText(content);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [content, isLatest]);

  return (
    <div className="relative">
      <p className="whitespace-pre-line font-sans tracking-wide leading-relaxed">
        {displayedText}
        {isTyping && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-gold-400 animate-pulse align-middle shadow-[0_0_8px_#E5B80B]" />
        )}
      </p>
    </div>
  );
};

export const StudioChatbot: React.FC<ChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey there! I'm DotBot 🤖✨\n\nHow can I help you today? Ask me anything about our interior design, custom curtains, wallpapers, or wall textures!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatbotRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [messages, isOpen, loading]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(scrollToBottom, 50);

    try {
      // Format chat history for OpenRouter
      const historyPayload = messages
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }));

      const res: any = await api.post('/chat', {
        messages: historyPayload,
      });

      const replyText = res.data?.reply || `That sounds exciting! We'd love to help you bring that space to life. What kind of colors or vibe do you like?`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTimeout(scrollToBottom, 50);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Hey! I'm here to help with all your interior design questions, curtains, wall textures, and wallpapers. What would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTimeout(scrollToBottom, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={chatbotRef} className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. SIMPLE ROUND BUBBLE WITH SPEECH POPUP */}
      {!isOpen && (
        <div className="relative flex items-center gap-3">
          {/* Speech Popup Prompt */}
          {showTooltip && (
            <div 
              onClick={() => setIsOpen(true)}
              className="cursor-pointer !bg-black/95 !border-gold-500/50 !text-white text-xs font-sans font-medium px-3.5 py-2 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.8)] flex items-center gap-2 animate-bounce select-none hover:border-gold-400 transition-all z-50"
            >
              <span className="!text-white">Ask our AI directly ✨</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} 
                className="text-neutral-400 hover:text-white ml-1 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {/* Simple Round Bubble with Permanent Deep Black Background */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full !bg-black border-2 border-gold-500 hover:border-gold-400 p-2 shadow-[0_0_25px_rgba(0,0,0,0.9)] hover:shadow-[0_0_35px_rgba(229,184,11,0.7)] transition-all duration-300 active:scale-90 flex items-center justify-center group z-50"
            aria-label="Open DotBot"
          >
            <img 
              src={logo} 
              alt="DotBot" 
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(229,184,11,0.7)] group-hover:scale-110 transition-transform" 
            />
            {/* Green Online Dot */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </button>
        </div>
      )}

      {/* 2. CHATBOT WINDOW MODAL */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-charcoal-950/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Futuristic Cyber Top Scanning Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent relative overflow-hidden">
            <div className="w-1/2 h-full bg-gold-200 animate-cyber-scan blur-[1px]" />
          </div>

          {/* Header */}
          <div className="p-3.5 bg-charcoal-900/90 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-charcoal-950 border border-gold-500/50 flex items-center justify-center p-1.5 shadow-md">
                <img src={logo} alt="DotBot" className="w-full h-full object-contain" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-charcoal-950" />
              </div>
              <div>
                <h3 className="text-xs font-sans font-bold text-white flex items-center gap-1.5">
                  DotBot
                  <span className="text-[9px] px-1.5 py-0.2 bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono rounded">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-neutral-400 font-sans">Dot Inspire AI Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none bg-gradient-to-b from-charcoal-950 via-charcoal-950/90 to-charcoal-900">
            {messages.map((m, idx) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed transition-all ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-gold-400 via-gold-500 to-amber-500 text-charcoal-950 font-semibold rounded-tr-none shadow-[0_4px_15px_rgba(229,184,11,0.25)]'
                      : 'bg-charcoal-900/90 border border-neutral-800 text-neutral-200 rounded-tl-none shadow-xl relative overflow-hidden backdrop-blur-sm'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <AssistantMessageContent 
                      content={m.content} 
                      isLatest={idx === messages.length - 1 && !loading} 
                    />
                  ) : (
                    <p className="whitespace-pre-line">{m.content}</p>
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 mt-1 px-1 font-mono flex items-center gap-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {/* Futuristic Holographic Cyber Audio/Neural Thinking Animation */}
            {loading && (
              <div className="flex items-center gap-3 bg-charcoal-900/90 border border-gold-500/40 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-[0_0_20px_rgba(229,184,11,0.15)] animate-in fade-in duration-200">
                {/* Equalizer Waveform */}
                <div className="flex items-center gap-1 h-5">
                  <span className="w-1 bg-gold-400 rounded-full animate-wave-1 shadow-[0_0_6px_#E5B80B]" />
                  <span className="w-1 bg-gold-400 rounded-full animate-wave-2 shadow-[0_0_6px_#E5B80B]" />
                  <span className="w-1 bg-amber-300 rounded-full animate-wave-3 shadow-[0_0_6px_#E5B80B]" />
                  <span className="w-1 bg-gold-500 rounded-full animate-wave-4 shadow-[0_0_6px_#E5B80B]" />
                  <span className="w-1 bg-gold-400 rounded-full animate-wave-5 shadow-[0_0_6px_#E5B80B]" />
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-sans font-bold text-white tracking-wider flex items-center gap-1.5">
                    Synthesizing Design Concepts
                  </span>
                  <span className="text-[9px] text-gold-400 font-mono tracking-widest uppercase animate-pulse">
                    Analyzing Studio Knowledge...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-charcoal-900/95 border-t border-neutral-800/90 flex items-center gap-2 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about curtains, textures, 3D modeling..."
              className="flex-1 bg-charcoal-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white placeholder:text-neutral-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 disabled:opacity-30 text-charcoal-950 rounded-xl transition-all shadow-[0_0_15px_rgba(229,184,11,0.3)] active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
