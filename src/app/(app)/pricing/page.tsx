'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const freeFeatures = [
  'Daily AI Affirmations',
  'Mood Journal & Basic Sentiment',
  'Breathing Exercises',
  'Community Access',
  'Guided Meditations',
  'Soundscapes',
];
const proFeatures = [
  ...freeFeatures,
  'Personalized Zodiac Affirmations',
  'Advanced Sentiment Analysis',
  'Journal History',
  'AI Dream Journal',
  'Priority Support',
];

export default function PricingPage() {
  const { user, upgrade } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await upgrade();
      toast({
        title: 'Upgrade Successful!',
        description: 'You now have access to all Pro features.',
      });
      router.push('/home');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upgrade Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Choose Your Path</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Unlock a more personalized experience and deepen your journey of self-discovery.
        </p>
      </div>

      <div className="mt-12 grid max-w-4xl mx-auto gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Standard</CardTitle>
            <CardDescription>For starting your mindfulness journey.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p>
              <span className="font-headline text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Your Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary flex flex-col shadow-lg shadow-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-2xl text-primary">Cielo Pro</CardTitle>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>For the dedicated explorer of the self.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p>
              <span className="font-headline text-4xl font-bold">$9</span>
              <span className="text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {user?.isUpgraded ? (
              <Button className="w-full" disabled>
                You are a Pro Member
              </Button>
            ) : (
              <Button className="w-full" onClick={handleUpgrade} disabled={isLoading}>
                {isLoading ? 'Upgrading...' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
