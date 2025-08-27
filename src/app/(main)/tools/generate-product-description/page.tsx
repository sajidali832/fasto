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
import { Loader2, Copy, Check, ArrowLeft, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateProductDescription, GenerateProductDescriptionInput } from '@/ai/flows/generate-product-description';
import Link from 'next/link';

const FormSchema = z.object({
  productName: z.string().min(1, 'Product name is required.'),
  features: z.string().min(1, 'Features are required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  tone: z.string().min(1, 'Tone is required.'),
});

export default function GenerateProductDescriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateProductDescriptionInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productName: '',
      features: '',
      targetAudience: '',
      tone: 'Persuasive',
    },
  });

  const onSubmit: SubmitHandler<GenerateProductDescriptionInput> = async (data) => {
    setIsLoading(true);
    setGeneratedDescription('');
    try {
      const result = await generateProductDescription(data);
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
        type: 'Product Description',
        title: `Description for ${form.getValues('productName')}`,
        content: generatedDescription,
        date: new Date().toISOString(),
        tags: ['product', 'ecommerce', form.getValues('productName')]
      };
      localStorage.setItem('fasto_savedItems', JSON.stringify([newItem, ...savedItems]));
      toast({
        title: 'Saved!',
        description: 'Product description saved.',
      });
    } catch (error) {
       console.error('Failed to save description:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not save the description.',
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
            <h1 className="text-2xl font-bold md:text-3xl">Product Description Generator</h1>
            <p className="text-muted-foreground">Create compelling descriptions for e-commerce.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Provide details to generate a high-converting description.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="e.g., Aura Smart Watch" {...form.register('productName')} />
                {form.formState.errors.productName && <p className="text-sm text-destructive">{form.formState.errors.productName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (comma-separated)</Label>
                <Textarea id="features" placeholder="e.g., 14-day battery, waterproof, GPS tracking" {...form.register('features')} />
                {form.formState.errors.features && <p className="text-sm text-destructive">{form.formState.errors.features.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input id="targetAudience" placeholder="e.g., Fitness Enthusiasts" {...form.register('targetAudience')} />
                  {form.formState.errors.targetAudience && <p className="text-sm text-destructive">{form.formState.errors.targetAudience.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input id="tone" placeholder="e.g., Energetic, Luxurious" {...form.register('tone')} />
                  {form.formState.errors.tone && <p className="text-sm text-destructive">{form.formState.errors.tone.message}</p>}
                </div>
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
              <CardTitle>Generating Your Description...</CardTitle>
               <CardDescription>The AI is finding the right words to sell your product.</CardDescription>
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
                <CardDescription>Your new product description is ready.</CardDescription>
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
