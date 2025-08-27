'use server';
/**
 * @fileOverview A script generation AI agent.
 *
 * - generateScript - A function that handles the script generation process.
 * - GenerateScriptInput - The input type for the generateScript function.
 * - GenerateScriptOutput - The return type for the generateScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the script.'),
  platform: z.enum(['YouTube', 'Instagram', 'TikTok']).describe('The platform for which the script is being generated.'),
  duration: z.number().min(1).max(30).describe('The desired duration of the script in minutes.'),
  tone: z.string().describe('The desired tone of the script (e.g., funny, serious, educational).'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('The generated script.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;

export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
  return generateScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: {schema: GenerateScriptInputSchema},
  output: {schema: GenerateScriptOutputSchema},
  prompt: `You are an expert script writer for {{platform}} videos.  Generate a {{duration}} minute script on the topic of "{{topic}}" with a {{tone}} tone.\n\nScript:`,
});

const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
