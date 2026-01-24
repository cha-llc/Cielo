import { genkit } from 'genkit';
import { openAI } from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: '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',
    }),
  ],
  model: 'openai/gpt-4',
});
