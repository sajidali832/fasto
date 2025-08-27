'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Copy, MoreVertical, Search, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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

interface SavedItem {
 id: string;
 type: 'Script' | 'Caption' | 'Bio' | 'Description' | 'Image-Text';
 title: string;
 content: string;
 date: string;
 tags: string[];
}

const initialSavedItems: SavedItem[] = [
  { id: '1', type: 'Script', title: 'YouTube script for "History of AI"', content: 'Scene 1: Introduction to the Turing Test...', date: '2023-10-26', tags: ['YouTube', 'AI', 'History'] },
  { id: '2', type: 'Caption', title: 'Instagram post about new product', content: 'Unveiling our latest creation! ✨ #NewProduct #Innovation', date: '2023-10-25', tags: ['Instagram', 'Marketing'] },
  { id: '3', type: 'Bio', title: 'Professional Twitter Bio', content: 'Exploring the intersection of AI and creativity. Building the future, one line of code at a time.', date: '2023-10-24', tags: ['Twitter', 'Bio', 'Tech'] },
  { id: '4', type: 'Description', title: 'Product description for "Smart Mug"', content: 'The Smart Mug keeps your coffee at the perfect temperature from the first sip to the last. Control it with our app!', date: '2023-10-23', tags: ['E-commerce', 'Product'] },
];

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState(initialSavedItems);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
     if (!searchTerm) return savedItems;
     return savedItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
     );
  }, [searchTerm, savedItems]);

  const deleteItem = (id: string) => {
    setSavedItems(currentItems => currentItems.filter(item => item.id !== id));
    toast({ description: "Item removed from saved." });
  };
  
  const copyItem = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ description: "Content copied to clipboard." });
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Saved Creations</h1>
                    <p className="text-muted-foreground">Access and manage all your saved content.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search saved items..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
                <Card key={item.id} className="glass-card flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="font-medium">{item.type}</Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert('Edit functionality not implemented.')}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyItem(item.content)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this saved item.
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                    <h3 className="font-semibold text-lg flex-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3 h-[60px]">{item.content}</p>
                    <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 px-4 rounded-lg border-2 border-dashed border-border/50 col-span-full">
                    <Bookmark className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-medium">No Saved Items Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Your saved results will appear here once you save them.</p>
                </div>
            )}
        </div>
    </div>
  );
}
