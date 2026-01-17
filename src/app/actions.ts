
'use server';
import { generateDailyAffirmation } from '@/ai/flows/generate-daily-affirmation';
import { analyzeMoodJournalSentiment } from '@/ai/flows/analyze-mood-journal-sentiment';

export async function getAffirmation(zodiacSign: string | null) {
  try {
    const result = await generateDailyAffirmation({ zodiacSign: zodiacSign ?? undefined });
    return result.affirmation;
  } catch (error) {
    console.error('Error generating affirmation:', error);
    return "Could not generate an affirmation at this time. Please try again later.";
  }
}

export type SentimentAnalysis = {
  sentiment: string;
  score: number;
  analysis: string;
} | null;

export async function analyzeSentiment(journalEntry: string): Promise<SentimentAnalysis> {
  if (!journalEntry.trim()) {
    return null;
  }
  try {
    const result = await analyzeMoodJournalSentiment({ journalEntry });
    return result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: "Error", score: 0, analysis: "Could not analyze the sentiment of your journal entry." };
  }
}
