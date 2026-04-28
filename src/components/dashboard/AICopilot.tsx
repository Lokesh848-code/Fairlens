import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your FairLens Copilot. I can help you analyze bias metrics, explain SHAP values, or suggest mitigation strategies. How can I assist you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      // In a real app, this would call a /api/chat endpoint
      // For this demo, we'll simulate a smart response or use Gemini if wired.
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the fairness engine. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-[380px] h-[500px] flex flex-col shadow-2xl border-slate-200 overflow-hidden bg-white/95 backdrop-blur-sm">
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm italic tracking-tight">FairLens Copilot</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Audit Assistant</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                      msg.role === "assistant" ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-slate-100 border-slate-200 text-slate-600"
                    )}>
                      {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-xs font-medium leading-relaxed",
                      msg.role === "assistant" ? "bg-slate-50 text-slate-800 rounded-tl-none" : "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl animate-pulse flex gap-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-slate-50/50">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your audit..."
                    className="h-10 text-xs border-slate-200 bg-white"
                  />
                  <Button type="submit" size="icon" className="shrink-0 h-10 w-10 bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-500",
          isOpen ? "bg-slate-900 rotate-90" : "bg-indigo-600 hover:bg-indigo-700 scale-110"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}
