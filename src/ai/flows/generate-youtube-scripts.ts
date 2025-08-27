'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating YouTube scripts based on user-specified criteria such as topic, duration, and tone.
 * 
 * - generateYoutubeScript - A function that orchestrates the generation of YouTube scripts.
 * - GenerateYoutubeScriptInput - The input type for the generateYoutubeScript function.
 * - GenerateYoutubeScriptOutput - The return type for the generateYoutubeScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYoutubeScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the YouTube script.'),
  duration: z
    .number()
    .min(1)
    .max(30)
    .describe('The desired duration of the script in minutes (1-30).'),
  tone: z.string().describe('The desired tone of the script (e.g., funny, serious, educational).'),
});
export type GenerateYoutubeScriptInput = z.infer<typeof GenerateYoutubeScriptInputSchema>;

const GenerateYoutubeScriptOutputSchema = z.object({
  script: z.string().describe('The generated YouTube script.'),
});
export type GenerateYoutubeScriptOutput = z.infer<typeof GenerateYoutubeScriptOutputSchema>;

export async function generateYoutubeScript(input: GenerateYoutubeScriptInput): Promise<GenerateYoutubeScriptOutput> {
  return generateYoutubeScriptFlow(input);
}

const generateYoutubeScriptPrompt = ai.definePrompt({
  name: 'generateYoutubeScriptPrompt',
  input: {schema: GenerateYoutubeScriptInputSchema},
  output: {schema: GenerateYoutubeScriptOutputSchema},
  prompt: `You are an expert YouTube script writer. Generate a script based on the following criteria:

Topic: {{{topic}}}
Duration: {{{duration}}} minutes
Tone: {{{tone}}}

Make sure the script is well-formatted and engaging. Do not include any symbols like *-..-#@.`,
});

const generateYoutubeScriptFlow = ai.defineFlow(
  {
    name: 'generateYoutubeScriptFlow',
    inputSchema: GenerateYoutubeScriptInputSchema,
    outputSchema: GenerateYoutubeScriptOutputSchema,
  },
  async input => {
    const {output} = await generateYoutubeScriptPrompt(input);
    return output!;
  }
);
