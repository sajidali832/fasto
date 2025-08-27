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
import { generateScript, GenerateScriptInput } from '@/ai/flows/generate-script';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  platform: z.enum(['YouTube', 'Instagram', 'TikTok']),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute.').max(30, 'Duration cannot exceed 30 minutes.'),
  tone: z.string().min(1, 'Tone is required.'),
});

export default function GenerateScriptPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateScriptInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      platform: 'YouTube',
      duration: 5,
      tone: 'Informative',
    },
  });

  const onSubmit: SubmitHandler<GenerateScriptInput> = async (data) => {
    setIsLoading(true);
    setGeneratedScript('');
    try {
      const result = await generateScript(data);
      setGeneratedScript(result.script);
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate script. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Script copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };
  
  const handleSave = () => {
    if (!generatedScript) return;
    try {
      const savedItems = JSON.parse(localStorage.getItem('fasto_savedItems') || '[]');
      const newItem = {
        id: Date.now().toString(),
        type: 'Script',
        title: `Script for ${form.getValues('platform')}: ${form.getValues('topic')}`,
        content: generatedScript,
        date: new Date().toISOString(),
        tags: ['script', form.getValues('platform').toLowerCase(), form.getValues('tone').toLowerCase()]
      };
      localStorage.setItem('fasto_savedItems', JSON.stringify([newItem, ...savedItems]));
      toast({
        title: 'Saved!',
        description: 'Script saved to your collection.',
      });
    } catch (error) {
       console.error('Failed to save script:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not save the script.',
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
            <h1 className="text-2xl font-bold md:text-3xl">Generate Script</h1>
            <p className="text-muted-foreground">Create a video script for your chosen platform.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Script Details</CardTitle>
            <CardDescription>Fill in the details below to generate your script.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g., The history of artificial intelligence" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                   <Controller
                      name="platform"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="platform">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YouTube">YouTube</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" {...form.register('duration')} />
                   {form.formState.errors.duration && <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Funny, Educational" {...form.register('tone')} />
                   {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Script...</CardTitle>
              <CardDescription>The AI is writing your masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        )}

        {generatedScript && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Script</CardTitle>
                <CardDescription>Your AI-powered script is ready.</CardDescription>
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
                value={generatedScript}
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
