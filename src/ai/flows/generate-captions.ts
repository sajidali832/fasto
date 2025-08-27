'use server';

/**
 * @fileOverview A tool to generate social media captions.
 *
 * - generateCaptions - A function that generates social media captions.
 * - GenerateCaptionsInput - The input type for the generateCaptions function.
 * - GenerateCaptionsOutput - The return type for the generateCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionsInputSchema = z.object({
  topic: z.string().describe('The topic of the social media post.'),
  platform:
    z.string()
      .describe(
        'The social media platform for which the caption is being generated (e.g., Instagram, Twitter, Facebook, TikTok).'
      ),
  tone:
    z.string()
      .describe(
        'The desired tone of the caption (e.g., funny, serious, inspirational, informative).'
      ),
  keywords: z
    .string()
    .optional()
    .describe('Optional keywords to include in the caption.'),
});
export type GenerateCaptionsInput = z.infer<typeof GenerateCaptionsInputSchema>;

const GenerateCaptionsOutputSchema = z.object({
  caption: z.string().describe('The generated social media caption.'),
});
export type GenerateCaptionsOutput = z.infer<typeof GenerateCaptionsOutputSchema>;

export async function generateCaptions(
  input: GenerateCaptionsInput
): Promise<GenerateCaptionsOutput> {
  return generateCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionsPrompt',
  input: {schema: GenerateCaptionsInputSchema},
  output: {schema: GenerateCaptionsOutputSchema},
  prompt: `You are an expert social media manager specializing in crafting engaging captions.\n
  Generate a caption for a social media post with the following characteristics:\n
  Topic: {{{topic}}}\n  Platform: {{{platform}}}\n  Tone: {{{tone}}}\n  Keywords: {{#if keywords}} {{{keywords}}} {{else}} None {{/if}}\n
  Ensure the caption is appropriate for the specified platform and tone. Be concise and attention-grabbing.\n  Since you are generating captions, do not include any hashtags or calls to action unless they are necessary for the caption.\n  Do not exceed 280 characters. Keep in mind you are using the "Generate Captions" tool and it is important to ensure the output meets my intention for a social media post.\n  `,
});

const generateCaptionsFlow = ai.defineFlow(
  {
    name: 'generateCaptionsFlow',
    inputSchema: GenerateCaptionsInputSchema,
    outputSchema: GenerateCaptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
