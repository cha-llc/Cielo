'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Moon, Wand2 } from 'lucide-react';

export default function DreamJournalPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">AI Dream Journal</h1>
        <p className="text-lg text-muted-foreground">Unlock the secrets of your subconscious mind.</p>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Dream</CardTitle>
            <CardDescription>Our AI will analyze its meaning and symbolism.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Last night, I dreamt of..." className="min-h-[150px]" />
            <Button className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              Interpret Dream
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
