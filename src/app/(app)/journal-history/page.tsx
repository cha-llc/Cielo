'use client';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: number;
  type?: 'manual' | 'mood' | 'dream';
};

const storageKey = 'cielo.journalEntries';
const todayISO = () => new Date().toISOString().slice(0, 10);
const typeLabel = (type?: JournalEntry['type']) => {
  switch (type) {
    case 'mood':
      return 'Mood';
    case 'dream':
      return 'Dream';
    default:
      return 'Manual';
  }
};

export default function JournalHistoryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(todayISO());
  const [error, setError] = useState('');

  if (!user?.isUpgraded) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Journal History (Pro)</CardTitle>
            <CardDescription>
              This feature is available to Cielo Pro members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as JournalEntry[];
      if (Array.isArray(parsed)) {
        setEntries(
          parsed.map(entry => ({
            ...entry,
            type: entry.type ?? 'manual',
          }))
        );
      }
    } catch {
      // Ignore invalid localStorage data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt - a.createdAt);
  }, [entries]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (content.trim().length < 5) {
      setError('Entry must be at least 5 characters.');
      return;
    }
    setError('');
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
    setEntries(prev => [
      {
        id,
        title: title.trim(),
        content: content.trim(),
        date: entryDate,
        createdAt: Date.now(),
        type: 'manual',
      },
      ...prev,
    ]);
    setTitle('');
    setContent('');
    setEntryDate(todayISO());
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Journal History</h1>
        <p className="text-lg text-muted-foreground">Review your past entries and track your journey.</p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add Journal Entry</CardTitle>
            <CardDescription>Log a new entry manually and keep it in your history.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entry-title">Title</Label>
                <Input
                  id="entry-title"
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  placeholder="Optional title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry-date">Date</Label>
                <Input
                  id="entry-date"
                  type="date"
                  value={entryDate}
                  onChange={event => setEntryDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entry-content">Entry</Label>
                <Textarea
                  id="entry-content"
                  value={content}
                  onChange={event => setContent(event.target.value)}
                  placeholder="Write about your day..."
                  className="min-h-[140px]"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entry History</CardTitle>
            <CardDescription>Saved locally in this browser.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedEntries.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <p>No entries yet.</p>
              </div>
            ) : (
              sortedEntries.map(entry => (
                <div key={entry.id} className="rounded-lg border border-border/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{entry.title || 'Untitled Entry'}</h3>
                      <Badge variant="secondary">{typeLabel(entry.type)}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{entry.content}</p>
                </div>
              ))
            )}
          </CardContent>
          {sortedEntries.length > 0 && (
            <CardFooter className="text-xs text-muted-foreground">
              Entries are stored in your browser only.
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
