'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Check, ArrowLeft, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSongLyrics, GenerateSongLyricsInput } from '@/ai/flows/generate-song-lyrics';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  genre: z.enum(['Pop', 'Rap', 'Rock', 'Country', 'Electronic']),
  mood: z.string().min(1, 'Mood is required.'),
  structure: z.string().min(1, 'Structure is required.'),
});

export default function GenerateSongLyricsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateSongLyricsInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      genre: 'Pop',
      mood: 'Happy',
      structure: 'Verse - Chorus - Verse - Chorus - Bridge - Chorus',
    },
  });

  const onSubmit: SubmitHandler<GenerateSongLyricsInput> = async (data) => {
    setIsLoading(true);
    setGeneratedLyrics('');
    try {
      const result = await generateSongLyrics(data);
      setGeneratedLyrics(result.lyrics);
    } catch (error) {
      console.error('Error generating lyrics:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate lyrics. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedLyrics) {
      navigator.clipboard.writeText(generatedLyrics);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Lyrics copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (!generatedLyrics) return;
    try {
      const savedItems = JSON.parse(localStorage.getItem('fasto_savedItems') || '[]');
      const newItem = {
        id: Date.now().toString(),
        type: 'Lyrics',
        title: `Lyrics for ${form.getValues('genre')} song: ${form.getValues('topic')}`,
        content: generatedLyrics,
        date: new Date().toISOString(),
        tags: ['lyrics', form.getValues('genre').toLowerCase(), form.getValues('mood').toLowerCase()]
      };
      localStorage.setItem('fasto_savedItems', JSON.stringify([newItem, ...savedItems]));
      toast({
        title: 'Saved!',
        description: 'Lyrics saved to your collection.',
      });
    } catch (error) {
       console.error('Failed to save lyrics:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not save the lyrics.',
       });
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/tools" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Song Lyrics / Rap Generator</h1>
            <p className="text-muted-foreground">Create lyrics for your next hit song.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Song Details</CardTitle>
            <CardDescription>Fill in the details to generate your lyrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Theme</Label>
                <Input id="topic" placeholder="e.g., Summer love, Overcoming challenges" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                   <Controller
                      name="genre"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="genre">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pop">Pop</SelectItem>
                            <SelectItem value="Rap">Rap</SelectItem>
                            <SelectItem value="Rock">Rock</SelectItem>
                            <SelectItem value="Country">Country</SelectItem>
                            <SelectItem value="Electronic">Electronic</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Input id="mood" placeholder="e.g., Upbeat, Melancholic, Angry" {...form.register('mood')} />
                   {form.formState.errors.mood && <p className="text-sm text-destructive">{form.formState.errors.mood.message}</p>}
                </div>
              </div>

               <div className="space-y-2">
                <Label htmlFor="structure">Song Structure</Label>
                <Input id="structure" placeholder="e.g., Verse - Chorus - Bridge" {...form.register('structure')} />
                 {form.formState.errors.structure && <p className="text-sm text-destructive">{form.formState.errors.structure.message}</p>}
              </div>


              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Lyrics
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
           <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Your Lyrics...</CardTitle>
              <CardDescription>The AI is writing a masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        )}

        {generatedLyrics && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                <CardTitle>Generated Lyrics</CardTitle>
                <CardDescription>Your AI-powered song is ready.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                 <Button variant="outline" size="icon" onClick={handleSave}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedLyrics}
                readOnly
                className="h-96 w-full resize-none bg-background"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
