'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Search, CornerDownLeft } from 'lucide-react';
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

// In a real app, this data would come from a database or a global state management solution.
interface HistoryItem {
  id: string;
  title: string;
  date: string;
  preview: string;
}

const initialHistory: HistoryItem[] = [
  { id: '1', title: 'Brainstorming a new app idea', date: '2023-10-27', preview: 'User: What are some good ideas for a new mobile app? AI: How about a social platform for pet owners to...' },
  { id: '2', title: 'Translating a phrase to Spanish', date: '2023-10-26', preview: 'User: How do you say "hello, how are you?" in Spanish? AI: "Hola, ¿cómo estás?" is the translation...' },
  { id: '3', title: 'Python code for a web scraper', date: '2023-10-25', preview: 'User: Write a python script to scrape a website. AI: Sure, here is a simple script using BeautifulSoup...' },
  { id: '4', title: 'Marketing copy for a new product', date: '2023-10-24', preview: 'User: I need some marketing copy for a new coffee blend. AI: Introducing "Morning Star", a rich and aromatic blend...' },
];


export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredHistory = useMemo(() => {
    if (!searchTerm) return historyItems;
    return historyItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, historyItems]);

  const deleteItem = (id: string) => {
    setHistoryItems(currentItems => currentItems.filter(item => item.id !== id));
    toast({
      description: 'Chat deleted from history.',
    });
  };

  const deleteAllItems = () => {
     setHistoryItems([]);
     toast({
      description: 'All chat history has been cleared.',
    });
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
                    This action cannot be undone. This will permanently delete all of your chat history.
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
                     <Button variant="ghost" size="sm">
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
                            This action cannot be undone. This will permanently delete this chat from your history.
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
            <div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-border/50">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-4 text-lg font-medium">No Results Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or start a new chat.</p>
            </div>
          )}
        </div>
       </div>
    </div>
  );
}
