'use client';

import { analyzeSentiment, type SentimentAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  journalEntry: z.string().min(10, {
    message: 'Your journal entry must be at least 10 characters long.',
  }),
});

export default function JournalPage() {
  const [analysis, setAnalysis] = useState<SentimentAnalysis>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { journalEntry: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    const result = await analyzeSentiment(values.journalEntry);
    if (result?.sentiment === 'Error') {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.analysis,
      });
    } else {
      setAnalysis(result);
    }
    setIsLoading(false);
  }

  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-accent';
      case 'negative':
        return 'bg-primary';
      case 'neutral':
        return 'bg-muted-foreground';
      default:
        return 'bg-secondary';
    }
  };

  const sentimentScore = analysis ? (analysis.score + 1) * 50 : 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Mood Journal</h1>
        <p className="text-lg text-muted-foreground">Reflect on your day and gain new insights.</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
            <CardDescription>How are you feeling today? Write it down.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="journalEntry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Thoughts</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Today I felt..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Analyze Sentiment
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>AI-powered insights into your entry.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                <p>Waiting for your entry...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div>
                  <FormLabel>Overall Sentiment</FormLabel>
                  <p className="font-headline text-2xl font-bold capitalize">{analysis.sentiment}</p>
                </div>
                <div>
                  <FormLabel>Sentiment Score</FormLabel>
                  <Progress value={sentimentScore} indicatorClassName={getSentimentColor(analysis.sentiment)} />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Negative</span>
                    <span>Neutral</span>
                    <span>Positive</span>
                  </div>
                </div>
                <div>
                  <FormLabel>Deeper Analysis</FormLabel>
                  <p className="text-sm text-foreground">{analysis.analysis}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                <p>Your analysis will appear here once you submit an entry.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
