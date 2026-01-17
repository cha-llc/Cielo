'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

export default function SoundscapesPage() {
  const soundscapes = [
    { title: 'Rainforest', description: 'Immerse yourself in the sounds of nature.' },
    { title: 'Ocean Waves', description: 'Relax to the gentle rhythm of the sea.' },
    { title: 'Cozy Fireplace', description: 'Warm up with the crackling of a fire.' },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Soundscapes</h1>
        <p className="text-lg text-muted-foreground">Transport your mind to a tranquil environment.</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {soundscapes.map((scape) => (
          <Card key={scape.title}>
            <CardHeader>
              <CardTitle>{scape.title}</CardTitle>
              <CardDescription>{scape.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Headphones className="mr-2 h-4 w-4" />
                Listen
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
