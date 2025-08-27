'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting text from images.
 *
 * - imageToText - A function that takes an image as input and returns the text found in the image.
 * - ImageToTextInput - The input type for the imageToText function.
 * - ImageToTextOutput - The return type for the imageToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ImageToTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be converted to text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageToTextInput = z.infer<typeof ImageToTextInputSchema>;

const ImageToTextOutputSchema = z.object({
  text: z.string().describe('The text extracted from the image.'),
});
export type ImageToTextOutput = z.infer<typeof ImageToTextOutputSchema>;

export async function imageToText(input: ImageToTextInput): Promise<ImageToTextOutput> {
  return imageToTextFlow(input);
}

const imageToTextPrompt = ai.definePrompt({
  name: 'imageToTextPrompt',
  input: {schema: ImageToTextInputSchema},
  output: {schema: ImageToTextOutputSchema},
  prompt: `Extract any text from the following image: {{media url=photoDataUri}}`,
});

const imageToTextFlow = ai.defineFlow(
  {
    name: 'imageToTextFlow',
    inputSchema: ImageToTextInputSchema,
    outputSchema: ImageToTextOutputSchema,
  },
  async input => {
    const {output} = await imageToTextPrompt(input);
    return output!;
  }
);
