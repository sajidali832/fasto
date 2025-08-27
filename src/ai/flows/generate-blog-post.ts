'use server';

/**
 * @fileOverview A tool to generate SEO-optimized blog posts.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The main topic of the blog post.'),
  keywords: z.string().describe('Comma-separated SEO keywords to include.'),
  tone: z.string().describe('The desired tone of the article (e.g., formal, conversational, humorous).'),
  targetAudience: z.string().describe('The intended audience for this blog post (e.g., beginners, experts, developers).'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  blogPost: z.string().describe('The full, SEO-optimized blog post content, formatted in Markdown.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are an expert SEO content writer specializing in creating long-form, engaging, and well-structured blog posts.
  Generate a comprehensive, SEO-optimized blog post on the following topic.

  Topic: {{{topic}}}
  Target Audience: {{{targetAudience}}}
  Tone: {{{tone}}}
  Keywords to include: {{{keywords}}}

  Instructions:
  1.  Create a compelling headline.
  2.  Write an introduction that hooks the reader.
  3.  Structure the post with clear headings and subheadings (using Markdown).
  4.  Naturally integrate the provided keywords throughout the article.
  5.  The article should be detailed, informative, and provide real value to the reader.
  6.  Conclude with a summary and a call-to-action if appropriate.
  7.  The entire output should be a single Markdown string.`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
