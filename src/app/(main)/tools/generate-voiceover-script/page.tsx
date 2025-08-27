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
import { generateVoiceoverScript, GenerateVoiceoverScriptInput } from '@/ai/flows/generate-voiceover-script';
import Link from 'next/link';

const FormSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute.'),
  tone: z.string().min(1, 'Tone is required.'),
  platform: z.string().min(1, 'Platform is required.'),
});

export default function GenerateVoiceoverScriptPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateVoiceoverScriptInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      duration: 2,
      tone: 'Informative',
      platform: 'YouTube Documentary',
    },
  });

  const onSubmit: SubmitHandler<GenerateVoiceoverScriptInput> = async (data) => {
    setIsLoading(true);
    setGeneratedScript('');
    try {
      const result = await generateVoiceoverScript(data);
      setGeneratedScript(result.script);
    } catch (error) {
      console.error('Error generating voiceover script:', error);
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
            <h1 className="text-2xl font-bold md:text-3xl">Voiceover Script Generator</h1>
            <p className="text-muted-foreground">Create professional voiceover scripts.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Script Details</CardTitle>
            <CardDescription>Fill in the details for your voiceover.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" placeholder="e.g., The history of ancient Rome" {...form.register('topic')} />
                {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" {...form.register('duration')} />
                  {form.formState.errors.duration && <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Authoritative, Friendly" {...form.register('tone')} />
                  {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input id="platform" placeholder="e.g., Corporate Video" {...form.register('platform')} />
                  {form.formState.errors.platform && <p className="text-sm text-destructive">{form.formState.errors.platform.message}</p>}
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
              <CardTitle>Generating Your Script...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-4 w-1/4 animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
            </CardContent>
          </Card>
        )}

        {generatedScript && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Script</CardTitle>
                <CardDescription>Your new voiceover script is ready.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedScript}
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
