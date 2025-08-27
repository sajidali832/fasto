'use server';
/**
 * @fileOverview A voiceover script generation AI agent.
 *
 * - generateVoiceoverScript - A function that handles the voiceover script generation process.
 * - GenerateVoiceoverScriptInput - The input type for the generateVoiceoverScript function.
 * - GenerateVoiceoverScriptOutput - The return type for the generateVoiceoverScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVoiceoverScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the voiceover script.'),
  duration: z.coerce.number().min(1).describe('The desired duration of the script in minutes.'),
  tone: z.string().describe('The desired tone of the voiceover (e.g., authoritative, friendly, energetic).'),
  platform: z.string().describe('The platform where this will be used (e.g., YouTube Documentary, Corporate Video, Advertisement).'),
});
export type GenerateVoiceoverScriptInput = z.infer<typeof GenerateVoiceoverScriptInputSchema>;

const GenerateVoiceoverScriptOutputSchema = z.object({
  script: z.string().describe('The generated voiceover script.'),
});
export type GenerateVoiceoverScriptOutput = z.infer<typeof GenerateVoiceoverScriptOutputSchema>;

export async function generateVoiceoverScript(input: GenerateVoiceoverScriptInput): Promise<GenerateVoiceoverScriptOutput> {
  return generateVoiceoverScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVoiceoverScriptPrompt',
  input: {schema: GenerateVoiceoverScriptInputSchema},
  output: {schema: GenerateVoiceoverScriptOutputSchema},
  prompt: `You are an expert script writer for voiceovers.
  Generate a {{duration}} minute voiceover script on the topic of "{{topic}}" with a {{tone}} tone for a {{platform}}.
  
  The script should be easy to read aloud, with natural pauses and clear language.
  Format the output as a single block of text.`,
});

const generateVoiceoverScriptFlow = ai.defineFlow(
  {
    name: 'generateVoiceoverScriptFlow',
    inputSchema: GenerateVoiceoverScriptInputSchema,
    outputSchema: GenerateVoiceoverScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
