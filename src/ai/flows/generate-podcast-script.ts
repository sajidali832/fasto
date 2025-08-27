'use server';

/**
 * @fileOverview A tool to generate podcast scripts.
 *
 * - generatePodcastScript - A function that generates a podcast script.
 * - GeneratePodcastScriptInput - The input type for the generatePodcastScript function.
 * - GeneratePodcastScriptOutput - The return type for the generatePodcastScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePodcastScriptInputSchema = z.object({
  topic: z.string().describe('The topic of the podcast episode.'),
  duration: z.coerce.number().min(1).describe('The desired duration of the podcast in minutes.'),
  hosts: z.string().describe('The names of the hosts, separated by commas (e.g., Alex, Brenda).'),
  tone: z.string().describe('The desired tone of the podcast (e.g., conversational, investigative, humorous).'),
});
export type GeneratePodcastScriptInput = z.infer<typeof GeneratePodcastScriptInputSchema>;

const GeneratePodcastScriptOutputSchema = z.object({
  script: z.string().describe('The generated podcast script.'),
});
export type GeneratePodcastScriptOutput = z.infer<typeof GeneratePodcastScriptOutputSchema>;

export async function generatePodcastScript(
  input: GeneratePodcastScriptInput
): Promise<GeneratePodcastScriptOutput> {
  return generatePodcastScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePodcastScriptPrompt',
  input: {schema: GeneratePodcastScriptInputSchema},
  output: {schema: GeneratePodcastScriptOutputSchema},
  prompt: `You are an expert podcast scriptwriter.
  Generate a {{duration}} minute podcast script on the topic of "{{topic}}".

  Hosts: {{{hosts}}}
  Tone: {{{tone}}}

  Instructions:
  1.  Start with an engaging intro, including music cues if applicable.
  2.  Write dialogue for each host, clearly indicating who is speaking.
  3.  Structure the content logically with segments or talking points.
  4.  Include cues for sound effects or transitions where appropriate (e.g., "[SOUND of a gentle transition]").
  5.  End with a clear outro and call to action.
  6.  The final output should be a well-formatted script as a single string.`,
});

const generatePodcastScriptFlow = ai.defineFlow(
  {
    name: 'generatePodcastScriptFlow',
    inputSchema: GeneratePodcastScriptInputSchema,
    outputSchema: GeneratePodcastScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
