'use server';

/**
 * @fileOverview A tool for generating product descriptions for e-commerce.
 * 
 * - generateProductDescription - A function that handles the generation of product descriptions.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  features: z.string().describe('Key features of the product, separated by commas.'),
  targetAudience: z.string().describe('The target audience for the product (e.g., tech enthusiasts, busy moms, athletes).'),
  tone: z.string().describe('The desired tone of the description (e.g., persuasive, luxurious, playful).'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert e-commerce copywriter specializing in creating persuasive and high-converting product descriptions.

  Generate a compelling product description for the following product:

  Product Name: {{{productName}}}
  Key Features: {{{features}}}
  Target Audience: {{{targetAudience}}}
  Tone: {{{tone}}}

  Instructions:
  1.  Start with a catchy headline or opening sentence.
  2.  Elaborate on the key features, turning them into benefits for the customer.
  3.  Use a tone that resonates with the target audience.
  4.  Keep the description concise but informative. Use bullet points for readability.
  5.  End with a persuasive closing statement.
  
  The output should be a single block of text, well-formatted for a product page.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
