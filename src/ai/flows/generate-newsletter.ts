'use server';

/**
 * @fileOverview A tool to generate engaging newsletters for email campaigns.
 *
 * - generateNewsletter - A function that generates newsletter content.
 * - GenerateNewsletterInput - The input type for the generateNewsletter function.
 * - GenerateNewsletterOutput - The return type for the generateNewsletter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewsletterInputSchema = z.object({
  topic: z.string().describe('The central topic or theme of the newsletter.'),
  targetAudience: z.string().describe('The audience for the newsletter (e.g., Existing Customers, Potential Leads).'),
  tone: z.string().describe('The desired tone (e.g., Informative, Promotional, Friendly).'),
  callToAction: z.string().describe('The primary action you want readers to take (e.g., "Visit our new product page", "Read our latest blog post").'),
});
export type GenerateNewsletterInput = z.infer<typeof GenerateNewsletterInputSchema>;

const GenerateNewsletterOutputSchema = z.object({
  newsletter: z.string().describe('The generated newsletter content, including a subject line and body, ready for an email campaign.'),
});
export type GenerateNewsletterOutput = z.infer<typeof GenerateNewsletterOutputSchema>;

export async function generateNewsletter(
  input: GenerateNewsletterInput
): Promise<GenerateNewsletterOutput> {
  return generateNewsletterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsletterPrompt',
  input: {schema: GenerateNewsletterInputSchema},
  output: {schema: GenerateNewsletterOutputSchema},
  prompt: `You are an expert email marketer and copywriter.
  Generate a complete newsletter ready for an email campaign based on the following details. The output should be a single block of text and include a compelling Subject Line.

  Topic: {{{topic}}}
  Target Audience: {{{targetAudience}}}
  Tone: {{{tone}}}
  Call to Action: {{{callToAction}}}

  Instructions:
  1.  Write a catchy and concise subject line.
  2.  Write a personalized greeting.
  3.  Craft an engaging body text that explains the topic and provides value.
  4.  Seamlessly integrate the call to action.
  5.  End with a professional closing.
  6.  Format the output as a single string. Start with "Subject: [Your Subject Line]" followed by the body.`,
});

const generateNewsletterFlow = ai.defineFlow(
  {
    name: 'generateNewsletterFlow',
    inputSchema: GenerateNewsletterInputSchema,
    outputSchema: GenerateNewsletterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
