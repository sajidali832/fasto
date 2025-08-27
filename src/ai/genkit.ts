import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // Specify the API version.
      apiVersion: 'v1beta',
    }),
  ],
});
