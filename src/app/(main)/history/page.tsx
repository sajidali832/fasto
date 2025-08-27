'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Search, CornerDownLeft, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('fasto_chatHistory');
      if (savedChats) {
        const parsedChats: { id: string; text: string; isUser: boolean }[] = JSON.parse(savedChats);
        
        // Simple grouping logic: create a "history item" from the first user message of a session.
        // A more robust implementation would group messages by session ID.
        const sessions: HistoryItem[] = parsedChats
          .filter(m => m.isUser && m.text)
          .map(m => ({
            id: m.id,
            title: m.text.length > 30 ? m.text.substring(0, 30) + '...' : m.text,
            date: new Date(parseInt(m.id)).toISOString(),
            preview: m.text,
          }));
        setHistoryItems(sessions.reverse());
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load chat history.' });
    }
  }, [toast]);

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return historyItems;
    return historyItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, historyItems]);

  const deleteItem = (id: string) => {
    try {
      const savedChats = localStorage.getItem('fasto_chatHistory');
      if (savedChats) {
        let parsedChats = JSON.parse(savedChats);
        // This is a simplified deletion. A real app would need a more robust session management.
        // This removes the selected message, but not the whole conversation.
        parsedChats = parsedChats.filter((chat: { id: string }) => chat.id !== id);
        localStorage.setItem('fasto_chatHistory', JSON.stringify(parsedChats));
        setHistoryItems(currentItems => currentItems.filter(item => item.id !== id));
        toast({
          description: 'Chat deleted from history.',
        });
      }
    } catch (error) {
       console.error('Failed to delete history item', error);
       toast({ variant: 'destructive', title: 'Error', description: 'Could not delete chat.' });
    }
  };

  const deleteAllItems = () => {
    try {
      localStorage.removeItem('fasto_chatHistory');
      setHistoryItems([]);
      toast({
        description: 'All chat history has been cleared.',
      });
    } catch (error) {
        console.error('Failed to clear history', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not clear history.' });
    }
  }

  const resumeChat = () => {
      // In a real app, this would load the specific chat session.
      // For this implementation, we just navigate to the main chat page.
      router.push('/chat');
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Chat History</h1>
            <p className="text-muted-foreground">Review and manage your past conversations.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={historyItems.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all of your chat history from this device.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={deleteAllItems}
                    >
                    Delete All
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
       <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="glass-card overflow-hidden group transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{item.preview}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="ghost" size="sm" onClick={resumeChat}>
                      <CornerDownLeft className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this chat from your history on this device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteItem(item.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredHistory.length === 0 && (
             <Card className="glass-card col-span-full">
               <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Info className="h-5 w-5"/>
                  No Chat History
                </CardTitle>
               </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your chat history is stored locally on your device. Start a new conversation on the Chat page to see your history here.</p>
                {searchTerm && <p className="mt-2 text-sm text-muted-foreground">No results found for "{searchTerm}". Try a different search.</p>}
              </CardContent>
            </Card>
          )}
        </div>
       </div>
    </div>
  );
}
