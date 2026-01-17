import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-affirmation.ts';
import '@/ai/flows/analyze-mood-journal-sentiment.ts';
import '@/ai/flows/personalize-affirmation-with-zodiac.ts';