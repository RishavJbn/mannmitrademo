"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { aiChatbotSupport } from '@/ai/flows/ai-chatbot-support';
import { cn } from '@/lib/utils';
import { Spinner } from '../../../components/ui/spinner';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm here to support you. How are you feeling today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const result = await aiChatbotSupport({ message: input, history });

      if (result.redirect) {
        router.push(result.redirect);
        return;
      }
      
      const botMessage: Message = { role: 'bot', content: result.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { role: 'bot', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] md:h-screen flex flex-col p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold font-headline">AI Companion</h1>
        <p className="text-muted-foreground">A safe space to share and reflect.</p>
      </div>

      <Card className="flex-grow flex flex-col shadow-lg" style={{backgroundImage: 'url(/chat-bg-big.png)'}}>
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)] p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {message.role === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-xs md:max-w-md p-3 rounded-2xl text-sm md:text-base',
                    message.role === 'user'
                      ? 'bg-[#FFD3AC] text-[#2C3E50] rounded-br-none'
                      : 'bg-[#F4EBA9] text-[#2C3E50] rounded-bl-none'
                  )}>
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className='bg-[#ED766E]'>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                     <Spinner />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="min-h-0 flex-1 resize-none rounded-full"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" className='rounded-full' size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

// Re-using existing Card components from shadcn
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
