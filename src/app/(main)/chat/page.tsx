'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Paperclip, Send, User, Sparkles, X, RefreshCw } from 'lucide-react';
import { chatWithAi } from '@/ai/flows/ai-chat';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend && !imageFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      image: imagePreview || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setImageFile(null);
    setIsLoading(true);

    try {
      // In a real app, you'd handle image uploads properly.
      // For now, we are just sending the text.
      const aiResponse = await chatWithAi({ message: textToSend });
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errMessage: Message = {
         id: (Date.now() + 1).toString(),
         text: 'Sorry, I encountered an error. Please try again.',
         isUser: false,
      }
      setMessages(prev => [...prev, errMessage]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerate = (lastUserMessage: Message | undefined) => {
    if (lastUserMessage) {
        setMessages(prev => prev.slice(0, -1));
        handleSendMessage(lastUserMessage.text);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not find the previous message to regenerate.',
        });
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const lastUserMessage = messages.filter(m => m.isUser).pop();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-24">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && !isLoading && (
             <div className="text-center p-8 rounded-lg mt-[20vh]">
                <Sparkles className="mx-auto h-16 w-16 text-primary/30" strokeWidth={1.5} />
                <h2 className="mt-4 text-2xl font-bold">Start a conversation</h2>
                <p className="mt-2 text-muted-foreground">Ask me anything, or upload an image to begin.</p>
             </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start gap-4 ${message.isUser ? 'justify-end' : ''}`}>
              {!message.isUser && (
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
              <div className={`group relative max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${message.isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background rounded-bl-none'}`}>
                {message.image && (
                  <div className="mb-2">
                    <Image src={message.image} alt="uploaded content" width={200} height={200} className="rounded-lg" />
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                 
                <div className="absolute -bottom-8 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!message.isUser && message.text && (
                        <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(message.text)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleRegenerate(lastUserMessage)}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                     {message.isUser && message.text && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(message.text)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                     )}
                </div>
              </div>
              {message.isUser && (
                <Avatar className="h-9 w-9 border-2 border-background">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User Avatar"} />
                  <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="bg-background rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 p-2 backdrop-blur-sm md:p-4">
        <div className="mx-auto max-w-3xl">
          <Card className="shadow-lg">
            <CardContent className="p-2">
              {imagePreview && (
                <div className="p-2 relative w-fit">
                  <Image src={imagePreview} alt="Image preview" width={60} height={60} className="rounded-md" />
                  <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="relative flex items-center">
                <Input
                  placeholder="Type your message..."
                  className="flex-1 border-0 bg-transparent pr-20 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  disabled={isLoading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button size="icon" onClick={() => handleSendMessage()} disabled={isLoading || (!input.trim() && !imageFile)} className="rounded-full w-8 h-8">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
