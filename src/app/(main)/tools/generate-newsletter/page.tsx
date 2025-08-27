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
import { generateNewsletter, GenerateNewsletterInput } from '@/ai/flows/generate-newsletter';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  tone: z.string().min(1, 'Tone is required.'),
  callToAction: z.string().min(1, 'Call to action is required.'),
});

export default function GenerateNewsletterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNewsletter, setGeneratedNewsletter] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateNewsletterInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      targetAudience: '',
      tone: 'Friendly',
      callToAction: '',
    },
  });

  const onSubmit: SubmitHandler<GenerateNewsletterInput> = async (data) => {
    setIsLoading(true);
    setGeneratedNewsletter('');
    try {
      const result = await generateNewsletter(data);
      setGeneratedNewsletter(result.newsletter);
    } catch (error) {
      console.error('Error generating newsletter:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate newsletter. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedNewsletter) {
      navigator.clipboard.writeText(generatedNewsletter);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Newsletter copied to clipboard.',
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
            <h1 className="text-2xl font-bold md:text-3xl">Newsletter Generator</h1>
            <p className="text-muted-foreground">Craft ready-to-send emails for your campaigns.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Provide the details for your email newsletter.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Main Message</Label>
                <Input id="topic" placeholder="e.g., Weekly product updates, Flash sale announcement" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="callToAction">Call To Action (CTA)</Label>
                <Input id="callToAction" placeholder="e.g., Shop Now and Get 20% Off, Read The Full Article" {...form.register('callToAction')} />
                {form.formState.errors.callToAction && <p className="text-sm text-destructive">{form.formState.errors.callToAction.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input id="targetAudience" placeholder="e.g., Loyal Customers, New Subscribers" {...form.register('targetAudience')} />
                  {form.formState.errors.targetAudience && <p className="text-sm text-destructive">{form.formState.errors.targetAudience.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Promotional, Informative" {...form.register('tone')} />
                  {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Newsletter
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
           <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generating Your Newsletter...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-4 w-1/4 animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
            </CardContent>
          </Card>
        )}

        {generatedNewsletter && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Newsletter</CardTitle>
                <CardDescription>Your new email is ready to send.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedNewsletter}
                readOnly
                className="h-96 w-full resize-none bg-secondary/30"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
