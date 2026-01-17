'use client';

import { getAffirmation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const [affirmation, setAffirmation] = useState('');
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchAffirmation = useCallback(() => {
    startTransition(async () => {
      const zodiacSign = user?.isUpgraded ? user.zodiacSign : null;
      const result = await getAffirmation(zodiacSign);
      if (result.startsWith('Could not generate')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result,
        });
      } else {
        setAffirmation(result);
      }
    });
  }, [user, toast]);

  useEffect(() => {
    fetchAffirmation();
  }, [fetchAffirmation]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Welcome, {user?.username}
          </h1>
          <p className="text-lg text-muted-foreground">Here is your daily affirmation to guide you.</p>
        </div>
        <Button onClick={fetchAffirmation} disabled={isLoading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          New Affirmation
        </Button>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-gradient-to-br from-card to-secondary shadow-lg">
          <CardContent className="p-8">
            {isLoading && !affirmation ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-lg text-muted-foreground">Generating your affirmation...</p>
              </div>
            ) : (
              <blockquote className="space-y-4 text-center">
                <p className="font-headline text-3xl font-medium leading-tight text-foreground md:text-4xl">
                  &ldquo;{affirmation}&rdquo;
                </p>
                <footer className="text-base text-accent">Your Daily Focus</footer>
              </blockquote>
            )}
          </CardContent>
        </Card>
      </div>

      {!user?.isUpgraded && (
        <div className="mt-8">
          <Card className="border-primary bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-primary">Unlock Your Potential</CardTitle>
              <Sparkles className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary/80">
                Personalize your affirmations based on your zodiac sign.
              </CardDescription>
              <Button asChild className="mt-4">
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
