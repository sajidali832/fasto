'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Check, Image as ImageIcon, Upload, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { imageToText, ImageToTextInput } from '@/ai/flows/image-to-text';
import Image from 'next/image';
import Link from 'next/link';

export default function ImageToTextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExtractedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractText = async () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload an image first.',
      });
      return;
    }

    setIsLoading(true);
    setExtractedText('');
    try {
      const input: ImageToTextInput = { photoDataUri: imagePreview };
      const result = await imageToText(input);
      setExtractedText(result.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to extract text from the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setHasCopied(true);
      toast({
        title: 'Copied!',
        description: 'Extracted text copied to clipboard.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

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
            <h1 className="text-2xl font-bold md:text-3xl">Image to Text</h1>
            <p className="text-muted-foreground">Extract text from any image with a single click.</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image file to extract text from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div 
              className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border/50 hover:bg-secondary/50 transition-colors"
              onClick={triggerFileSelect}
             >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                 <Image src={imagePreview} alt="Selected preview" layout="fill" objectFit="contain" className="rounded-lg" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click or drag & drop to upload an image</p>
                </div>
              )}
            </div>

            <Button onClick={handleExtractText} disabled={isLoading || !imagePreview} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Extract Text
            </Button>
          </CardContent>
        </Card>

        {(isLoading || extractedText) && (
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>The text from your image is ready.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleCopy} disabled={!extractedText || isLoading}>
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-secondary" />
                </div>
               ) : (
                  <Textarea
                    value={extractedText}
                    readOnly
                    className="h-64 w-full resize-none bg-secondary/30"
                    placeholder="No text could be extracted from the image."
                  />
               )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
