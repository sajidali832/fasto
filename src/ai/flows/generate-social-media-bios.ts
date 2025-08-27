'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating social media bios.
 * It incorporates tool use to decide when to include particular information in the bio.
 *
 * It includes:
 * - `generateSocialMediaBios`: A function to generate social media bios based on user input.
 * - `GenerateSocialMediaBiosInput`: The input type for the `generateSocialMediaBios` function.
 * - `GenerateSocialMediaBiosOutput`: The output type for the `generateSocialMediaBios` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaBiosInputSchema = z.object({
  topic: z
    .string()
    .describe('The main topic or theme of the social media profile.'),
  keywords: z
    .string()
    .describe(
      'Relevant keywords that describe the profile, separated by commas.'
    ),
  tone: z.string().describe('The desired tone of the bio (e.g., professional, funny, quirky).'),
  platform: z
    .string()
    .describe('The social media platform the bio is for (e.g., Instagram, Twitter, LinkedIn).'),
});

export type GenerateSocialMediaBiosInput = z.infer<
  typeof GenerateSocialMediaBiosInputSchema
>;

const GenerateSocialMediaBiosOutputSchema = z.object({
  bio: z.string().describe('The generated social media bio.'),
});

export type GenerateSocialMediaBiosOutput = z.infer<
  typeof GenerateSocialMediaBiosOutputSchema
>;

export async function generateSocialMediaBios(
  input: GenerateSocialMediaBiosInput
): Promise<GenerateSocialMediaBiosOutput> {
  return generateSocialMediaBiosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaBiosPrompt',
  input: {schema: GenerateSocialMediaBiosInputSchema},
  output: {schema: GenerateSocialMediaBiosOutputSchema},
  prompt: `You are an expert social media strategist. Your goal is to write a creative and attention-grabbing bio for a social media profile, based on the provided information.\n\n  Here are the details:\n  - Topic: {{{topic}}}\n  - Keywords: {{{keywords}}}\n  - Tone: {{{tone}}}\n  - Platform: {{{platform}}}\n\nPlease generate a bio that is appropriate for the specified platform and tone. The bio should be concise, engaging, and reflective of the profile's main topic and keywords.\nThe output should be only the bio, and nothing else. Use the information about the tool to help inform the model about its purpose.`,
});

const generateSocialMediaBiosFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaBiosFlow',
    inputSchema: GenerateSocialMediaBiosInputSchema,
    outputSchema: GenerateSocialMediaBiosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
