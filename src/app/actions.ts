
'use server';
import { generateDailyAffirmation } from '@/ai/flows/generate-daily-affirmation';
import { analyzeMoodJournalSentiment } from '@/ai/flows/analyze-mood-journal-sentiment';
import { generateGuidedMeditation } from '@/ai/flows/generate-guided-meditation';

export async function getAffirmation(params: {
  zodiacSign: string | null;
  birthdate: string | null;
}) {
  try {
    const { zodiacSign, birthdate } = params;
    const result = await generateDailyAffirmation({
      zodiacSign: zodiacSign ?? undefined,
      birthdate: birthdate ?? undefined,
    });
    return result.affirmation;
  } catch (error) {
    console.error('Error generating affirmation:', error);
    return 'Could not generate an affirmation at this time. Please try again later.';
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

export type GuidedMeditation = {
  title: string;
  script: string;
  audioDataUri: string;
} | null;

export async function getGuidedMeditation(topic: string): Promise<GuidedMeditation> {
  try {
    const result = await generateGuidedMeditation({ topic });
    return result;
  } catch (error) {
    console.error('Error generating guided meditation:', error);
    return { title: "Error", script: (error as Error).message || "Could not generate meditation.", audioDataUri: "" };
  }
}
