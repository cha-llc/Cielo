import 'server-only';
import { genkit } from 'genkit';
import { openAI } from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
  ],
  model: 'openai/gpt-4.1',
});
