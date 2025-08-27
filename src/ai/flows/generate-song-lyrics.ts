'use server';

/**
 * @fileOverview A tool to generate song lyrics or rap verses.
 *
 * - generateSongLyrics - A function that generates lyrics.
 * - GenerateSongLyricsInput - The input type for the generateSongLyrics function.
 * - GenerateSongLyricsOutput - The return type for the generateSongLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSongLyricsInputSchema = z.object({
  topic: z.string().describe('The topic or theme of the song.'),
  genre: z.enum(['Pop', 'Rap', 'Rock', 'Country', 'Electronic']).describe('The musical genre.'),
  mood: z.string().describe('The desired mood of the song (e.g., happy, melancholic, angry, romantic).'),
  structure: z.string().describe('Desired song structure (e.g., Verse-Chorus-Verse-Chorus-Bridge-Chorus).'),
});
export type GenerateSongLyricsInput = z.infer<typeof GenerateSongLyricsInputSchema>;

const GenerateSongLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The generated song lyrics.'),
});
export type GenerateSongLyricsOutput = z.infer<typeof GenerateSongLyricsOutputSchema>;

export async function generateSongLyrics(
  input: GenerateSongLyricsInput
): Promise<GenerateSongLyricsOutput> {
  return generateSongLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSongLyricsPrompt',
  input: {schema: GenerateSongLyricsInputSchema},
  output: {schema: GenerateSongLyricsOutputSchema},
  prompt: `You are a professional songwriter and lyricist.
  Write song lyrics based on the following specifications.

  Genre: {{{genre}}}
  Topic: {{{topic}}}
  Mood: {{{mood}}}
  Structure: {{{structure}}}

  Instructions:
  1.  Follow the specified structure (e.g., [Verse 1], [Chorus]).
  2.  Use rhyming schemes and rhythms appropriate for the genre.
  3.  The lyrics should be creative, evocative, and fit the specified mood.
  4.  The final output should be the complete lyrics as a single string.`,
});

const generateSongLyricsFlow = ai.defineFlow(
  {
    name: 'generateSongLyricsFlow',
    inputSchema: GenerateSongLyricsInputSchema,
    outputSchema: GenerateSongLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
