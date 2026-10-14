import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  ShieldAlert,
  Loader2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

const QUICK_PROMPTS: Record<LanguageCode, string[]> = {
  en: [
    'How do I report a pothole or road damage?',
    'What does Critical / High Priority mean?',
    'Check status for complaint CIVIC-2026-A104',
    'Where to report an overflowing garbage bin?',
  ],
  te: [
    'రోడ్డుపై గుంతలు ఎలా నివేదించాలి?',
    'హై ప్రయారిటీ (High Priority) అంటే ఏమిటి?',
    'ఫిర్యాదు CIVIC-2026-A104 స్థితిని చూడండి',
    'చెత్త కుప్పల సమస్యను ఎక్కడ నమోదు చేయాలి?',
  ],
  hi: [
    'सड़क के गड्ढे की शिकायत कैसे दर्ज करें?',
    'अति-गंभीर प्राथमिकता (Critical Priority) का क्या अर्थ है?',
    'शिकायत CIVIC-2026-A104 की स्थिति बताएं',
    'कचरा ढेर की शिकायत कहां करें?',
  ],
  ta: [
    'ரோட்டு பள்ளத்தை எப்படி புகார் செய்வது?',
    'High Priority என்றால் என்ன?',
    'CIVIC-2026-A104 நிலையை பார்க்கவும்',
  ],
  kn: [
    'ರಸ್ತೆಯ ಗುಂಡಿಯನ್ನು ಹೇಗೆ ವರದಿ ಮಾಡುವುದು?',
    'Critical Priority ಎಂದರೇನು?',
  ],
  ml: [
    'റോഡിലെ കുഴികൾ എങ്ങനെ റിപ്പോർട്ട് ചെയ്യാം?',
  ],
  mr: [
    'रस्त्यावरील खड्डे कसे नोंदवायचे?',
  ],
  bn: [
    'রাস্তার গর্তের অভিযোগ কীভাবে করবেন?',
  ],
};

export const ChatbotModal: React.FC<ChatbotModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text:
        language === 'te'
          ? 'నమస్కారం! నేను సివిక్-బాట్ (CivicBot). పౌర సమస్యల నమోదు, ఫిర్యాదు స్థితి లేదా మున్సిపల్ సేవలపై మీకు ఏవైనా సందేహాలుంటే నన్ను అడగండి.'
          : language === 'hi'
          ? 'नमस्ते! मैं CivicBot हूँ। नागरिक शिकायत दर्ज करने, अपनी रिपोर्ट की स्थिति जांचने या नगरपालिका सेवाओं के बारे में कोई भी प्रश्न पूछें।'
          : "Hello! I'm CivicBot, your AI Municipal Helpline Assistant. How can I help you report civic issues or check complaint statuses today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: data.reply || 'I am processing municipal records. Please check the Citizen Portal for live ticket progress.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: 'The municipal assistant is temporarily offline. Please use the Citizen Portal directly or call 112 / 1913.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentPrompts = QUICK_PROMPTS[language] || QUICK_PROMPTS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg h-[620px] max-h-[90vh] rounded-3xl bg-[#090E1A] border border-cyan-500/40 shadow-2xl flex flex-col text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Chatbot Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-cyan-950/70 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">CivicBot Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-cyan-300 font-medium">
                Multilingual AI Citizen Grievance Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[9px] text-slate-400 block text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs pl-9">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>CivicBot is preparing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {currentPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type your civic question or complaint ID..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-xs sm:text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 hover:to-blue-400 font-bold transition disabled:opacity-40"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
