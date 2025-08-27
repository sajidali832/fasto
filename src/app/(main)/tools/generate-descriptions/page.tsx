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
import { generateDescriptions, GenerateDescriptionsInput } from '@/ai/flows/generate-descriptions';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  platform: z.string().min(1, 'Platform is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  keywords: z.string().optional(),
  context: z.string().optional(),
});

export default function GenerateDescriptionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateDescriptionsInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      platform: 'YouTube',
      tone: 'Engaging',
      keywords: '',
      context: '',
    },
  });

  const onSubmit: SubmitHandler<GenerateDescriptionsInput> = async (data) => {
    setIsLoading(true);
    setGeneratedDescription('');
    try {
      const result = await generateDescriptions(data);
      setGeneratedDescription(result.description);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate description. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedDescription) {
      navigator.clipboard.writeText(generatedDescription);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Description copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleSave = () => {
    if (!generatedDescription) return;
    try {
      const savedItems = JSON.parse(localStorage.getItem('fasto_savedItems') || '[]');
      const newItem = {
        id: Date.now().toString(),
        type: 'Description',
        title: `Description for ${form.getValues('platform')}: ${form.getValues('topic')}`,
        content: generatedDescription,
        date: new Date().toISOString(),
        tags: ['description', form.getValues('platform').toLowerCase(), ...(form.getValues('keywords')?.split(',').map(k => k.trim()) || [])]
      };
      localStorage.setItem('fasto_savedItems', JSON.stringify([newItem, ...savedItems]));
      toast({
        title: 'Saved!',
        description: 'Description saved to your collection.',
      });
    } catch (error) {
       console.error('Failed to save description:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not save description.',
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
            <h1 className="text-2xl font-bold md:text-3xl">Generate Descriptions</h1>
            <p className="text-muted-foreground">Write compelling descriptions for your content.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Provide details to generate a fitting description.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g., A review of the latest smartphone" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
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
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="TikTok">TikTok</SelectItem>
                          <SelectItem value="Blog Post">Blog Post</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Informative, Humorous, Professional" {...form.register('tone')} />
                  {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (optional)</Label>
                <Input id="keywords" placeholder="e.g., tech review, camera, battery life" {...form.register('keywords')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Additional Context (optional)</Label>
                <Textarea id="context" placeholder="e.g., Mention the new AI features and the 120Hz display." {...form.register('context')} />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Description
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Description...</CardTitle>
              <CardDescription>The AI is writing something amazing.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        )}

        {generatedDescription && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Description</CardTitle>
                <CardDescription>Your AI-powered description is ready.</CardDescription>
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
                value={generatedDescription}
                readOnly
                className="h-64 w-full resize-none bg-background"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
