'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function MeditationsPage() {
  const meditations = [
    { title: 'Morning Gratitude', duration: '5 min' },
    { title: 'Stress Relief', duration: '10 min' },
    { title: 'Deep Sleep', duration: '15 min' },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Guided Meditations</h1>
        <p className="text-lg text-muted-foreground">Find your inner peace and calm your mind.</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meditations.map((med) => (
          <Card key={med.title}>
            <CardHeader>
              <CardTitle>{med.title}</CardTitle>
              <CardDescription>{med.duration}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
