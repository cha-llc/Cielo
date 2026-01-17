
'use server';
import { generateDailyAffirmation } from '@/ai/flows/generate-daily-affirmation';
import { analyzeMoodJournalSentiment } from '@/ai/flows/analyze-mood-journal-sentiment';
import { generateGuidedMeditation } from '@/ai/flows/generate-guided-meditation';
import { generateSoundscape } from '@/ai/flows/generate-soundscape';
import { interpretDream } from '@/ai/flows/interpret-dream';
import { advancedAnalyzeSentiment as advancedSentimentFlow } from '@/ai/flows/advanced-analyze-sentiment';
import { generateSoundscapeIdeas } from '@/ai/flows/generate-soundscape-ideas';

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
  keyEmotions?: string[];
  actionableAdvice?: string;
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

export async function advancedAnalyzeSentiment(journalEntry: string): Promise<SentimentAnalysis> {
  if (!journalEntry.trim()) {
    return null;
  }
  try {
    const result = await advancedSentimentFlow({ journalEntry });
    return result;
  } catch (error) {
    console.error('Error analyzing advanced sentiment:', error);
    return { sentiment: "Error", score: 0, analysis: "Could not perform advanced analysis on your journal entry." };
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

export type Soundscape = {
  title: string;
  script: string;
  audioDataUri: string;
} | null;

export async function getSoundscape(topic: string): Promise<Soundscape> {
  try {
    const result = await generateSoundscape({ topic });
    return result;
  } catch (error) {
    console.error('Error generating soundscape:', error);
    return { title: "Error", script: (error as Error).message || "Could not generate soundscape.", audioDataUri: "" };
  }
}

export type SoundscapeIdea = {
  title: string;
  description: string;
  imageHint: string;
};

export async function getSoundscapeIdeas(count: number): Promise<SoundscapeIdea[]> {
    try {
        const { ideas } = await generateSoundscapeIdeas({ count });
        return ideas;
    } catch (error) {
        console.error('Error generating soundscape ideas:', error);
        return [{ title: 'Error', description: 'Could not generate new ideas. Please try again.', imageHint: 'error' }];
    }
}

export type DreamInterpretation = {
    analysis: string;
    sentiment: string;
    symbols: {
        symbol: string;
        meaning: string;
    }[];
} | null;

export async function getDreamInterpretation(dreamDescription: string): Promise<DreamInterpretation> {
    try {
        const result = await interpretDream({ dreamDescription });
        return result;
    } catch (error) {
        console.error('Error interpreting dream:', error);
        return { analysis: "Could not interpret your dream at this time. Please try again.", sentiment: "Error", symbols: [] };
    }
}
