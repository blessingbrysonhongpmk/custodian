import React, { useState, useRef, useEffect } from 'react';
import { askGeminiAI, isGeminiConfigured, type ChatMessage } from '../services/geminiService';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Key, 
  RefreshCw, 
  MessageSquare, 
  Leaf, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '🍃 **Welcome to Vanam Kuri AI!**\n\nI am your **Google Gemini** ecological assistant. Ask me anything about tree sapling care, health diagnosis, custody oath rules, or watering schedules!',
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasKey(isGeminiConfigured());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const botReplyText = await askGeminiAI(query, messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: '⚠️ Failed to get response from Gemini AI. Please verify network connection or your API key.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: '🌿 Watering Advice', query: 'What is the ideal watering schedule for young saplings?' },
    { label: '📜 Custody Oath', query: 'What are the duties of a Vanam Kuri tree custodian?' },
    { label: '🩺 Leaf Diagnosis', query: 'How to identify and treat yellow leaves on saplings?' },
    { label: '🌳 Best Native Trees', query: 'Which native trees are best for campus biodiversity?' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none font-sans">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="pointer-events-auto w-[92vw] sm:w-[400px] h-[550px] max-h-[82vh] bg-slate-900/95 text-slate-100 rounded-3xl shadow-2xl border border-emerald-500/30 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-3">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1">
                    Vanam Kuri AI
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                    hasKey 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {hasKey ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Gemini AI Active
                      </>
                    ) : (
                      <>
                        <Key className="w-3 h-3 text-amber-400" />
                        Demo Mode (Key Needed)
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title="Close chat"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* KEY WARNING BANNER (IF NOT CONFIGURED) */}
          {!hasKey && (
            <div className="px-4 py-2.5 bg-amber-950/60 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[11px] leading-tight">
                  Add <code className="bg-amber-900/80 text-amber-300 px-1 py-0.5 rounded font-mono">VITE_GEMINI_API_KEY</code> to <code className="font-mono">.env</code> for live responses!
                </p>
              </div>
            </div>
          )}

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-900/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5 text-xs font-bold shadow-sm">
                    🍃
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-950/80 border border-red-500/40 text-red-200 rounded-bl-none'
                      : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  <div className={`text-[9px] text-right font-mono opacity-60 mt-1 ${msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-emerald-900/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 text-xs font-bold">
                  🍃
                </div>
                <div className="bg-slate-800/90 border border-slate-700/60 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="ml-1 text-[11px] font-mono text-emerald-400/80">Gemini thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800/80 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-900/50 hover:border-emerald-500/40 transition-all shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Gemini about tree care, health, custody..."
              disabled={isTyping}
              className="flex-1 bg-slate-900 text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl transition-all shadow-md shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>
      )}

      {/* LAUNCHER FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-full shadow-2xl border border-emerald-300/30 transition-all transform hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-emerald-100" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">
          {isOpen ? 'Close Assistant' : 'Ask Gemini AI'}
        </span>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1.5 right-1.5" />
      </button>
    </div>
  );
};
