'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateBlogPost, GenerateBlogPostInput } from '@/ai/flows/generate-blog-post';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  keywords: z.string().min(1, 'Keywords are required.'),
  tone: z.string().min(1, 'Tone is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
});

export default function GenerateBlogPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateBlogPostInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      keywords: '',
      tone: 'Informative',
      targetAudience: '',
    },
  });

  const onSubmit: SubmitHandler<GenerateBlogPostInput> = async (data) => {
    setIsLoading(true);
    setGeneratedPost('');
    try {
      const result = await generateBlogPost(data);
      setGeneratedPost(result.blogPost);
    } catch (error) {
      console.error('Error generating blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate blog post. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Blog post copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/tools" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Blog Post Generator</h1>
            <p className="text-muted-foreground">Create SEO-optimized long-form articles.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Provide the details for your blog post.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g., The Future of Renewable Energy" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">SEO Keywords</Label>
                <Input id="keywords" placeholder="e.g., solar power, wind energy, sustainability" {...form.register('keywords')} />
                {form.formState.errors.keywords && <p className="text-sm text-destructive">{form.formState.errors.keywords.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Professional, Conversational" {...form.register('tone')} />
                  {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input id="targetAudience" placeholder="e.g., Industry Experts, Students" {...form.register('targetAudience')} />
                  {form.formState.errors.targetAudience && <p className="text-sm text-destructive">{form.formState.errors.targetAudience.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Your Article...</CardTitle>
              <CardDescription>The AI is writing, please wait a moment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-1/2 animate-pulse rounded-md bg-secondary" />
                </div>
                 <div className="space-y-2 pt-4">
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-1/2 animate-pulse rounded-md bg-secondary" />
                </div>
            </CardContent>
          </Card>
        )}

        {generatedPost && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Blog Post</CardTitle>
                <CardDescription>Your new article is ready.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedPost}
                readOnly
                className="h-[500px] w-full resize-none bg-secondary/30"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
