'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getSoundscape, type Soundscape } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const soundscapes = [
  {
    title: 'Rainforest',
    description: 'Immerse yourself in the sounds of nature.',
    imageId: 'soundscape-rainforest',
  },
  {
    title: 'Ocean Waves',
    description: 'Relax to the gentle rhythm of the sea.',
    imageId: 'soundscape-ocean',
  },
  {
    title: 'Cozy Fireplace',
    description: 'Warm up with the crackling of a fire.',
    imageId: 'soundscape-fireplace',
  },
];

export default function SoundscapesPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeSoundscape, setActiveSoundscape] = useState<Soundscape | null>(
    null
  );
  const { toast } = useToast();

  const handleListen = async (topic: string) => {
    setIsLoading(topic);
    setActiveSoundscape(null);
    const result = await getSoundscape(topic);
    setIsLoading(null);

    if (result?.title === 'Error') {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.script,
      });
    } else {
      setActiveSoundscape(result);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="border-b pb-4">
          <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Soundscapes
          </h1>
          <p className="text-lg text-muted-foreground">
            Transport your mind to a tranquil environment.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {soundscapes.map(scape => {
            const imageUrl = PlaceHolderImages.find(
              p => p.id === scape.imageId
            )?.imageUrl;
            const imageHint = PlaceHolderImages.find(
              p => p.id === scape.imageId
            )?.imageHint;

            return (
              <Card key={scape.title} className="overflow-hidden">
                {imageUrl && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={imageUrl}
                      alt={scape.title}
                      fill
                      className="object-cover"
                      data-ai-hint={imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{scape.title}</CardTitle>
                  <CardDescription>{scape.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleListen(scape.title)}
                    disabled={!!isLoading}
                  >
                    {isLoading === scape.title ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Dialog
        open={!!activeSoundscape}
        onOpenChange={open => !open && setActiveSoundscape(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeSoundscape?.title}</DialogTitle>
            <DialogDescription>
              Find a comfortable position, close your eyes, and listen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeSoundscape?.audioDataUri && (
              <audio controls autoPlay className="w-full">
                <source
                  src={activeSoundscape.audioDataUri}
                  type="audio/wav"
                />
                Your browser does not support the audio element.
              </audio>
            )}
            <ScrollArea className="h-40 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {activeSoundscape?.script}
              </p>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={() => setActiveSoundscape(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
