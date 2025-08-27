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
import { generateSocialMediaBios, GenerateSocialMediaBiosInput } from '@/ai/flows/generate-social-media-bios';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  platform: z.string().min(1, 'Platform is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  keywords: z.string().min(1, 'Keywords are required.'),
});

export default function GenerateBiosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateSocialMediaBiosInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      platform: 'Twitter',
      tone: 'Professional',
      keywords: '',
    },
  });

  const onSubmit: SubmitHandler<GenerateSocialMediaBiosInput> = async (data) => {
    setIsLoading(true);
    setGeneratedBio('');
    try {
      const result = await generateSocialMediaBios(data);
      setGeneratedBio(result.bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate bio. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedBio) {
      navigator.clipboard.writeText(generatedBio);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Bio copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };
  
  const handleSave = () => {
    if (!generatedBio) return;
    try {
      const savedItems = JSON.parse(localStorage.getItem('fasto_savedItems') || '[]');
      const newItem = {
        id: Date.now().toString(),
        type: 'Bio',
        title: `Bio for ${form.getValues('platform')}: ${form.getValues('topic')}`,
        content: generatedBio,
        date: new Date().toISOString(),
        tags: ['bio', form.getValues('platform').toLowerCase(), ...form.getValues('keywords').split(',').map(k => k.trim())]
      };
      localStorage.setItem('fasto_savedItems', JSON.stringify([newItem, ...savedItems]));
      toast({
        title: 'Saved!',
        description: 'Bio saved to your collection.',
      });
    } catch (error) {
       console.error('Failed to save bio:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not save bio.',
       });
    }
  }

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
            <h1 className="text-2xl font-bold md:text-3xl">Generate Social Media Bio</h1>
            <p className="text-muted-foreground">Create a compelling bio for your social profile.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Bio Details</CardTitle>
            <CardDescription>Tell us about your profile to generate the perfect bio.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Main Topic/Theme</Label>
                <Input id="topic" placeholder="e.g., AI and Creativity, Digital Art, Software Development" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>

               <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input id="keywords" placeholder="e.g., tech, art, frontend dev, innovator" {...form.register('keywords')} />
                 {form.formState.errors.keywords && <p className="text-sm text-destructive">{form.formState.errors.keywords.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                            <SelectItem value="GitHub">GitHub</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Professional, Quirky, Funny" {...form.register('tone')} />
                   {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Bio
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Bio...</CardTitle>
              <CardDescription>The AI is crafting the perfect bio.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        )}

        {generatedBio && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Bio</CardTitle>
                <CardDescription>Your new AI-powered bio is ready.</CardDescription>
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
                value={generatedBio}
                readOnly
                className="h-40 w-full resize-none bg-background"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
