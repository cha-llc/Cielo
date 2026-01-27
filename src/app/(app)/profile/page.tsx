'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { zodiacSigns } from '@/lib/zodiac-signs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { languages, type Language } from '@/lib/translations';

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional(),
  zodiacSign: z.string().optional(),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Please use YYYY-MM-DD format.' })
    .optional()
    .or(z.literal('')),
  language: z.string().optional(),
});

export default function ProfilePage() {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteSuggestions, setDeleteSuggestions] = useState('');
  const router = useRouter();
  const { t, setLanguage, language } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      username: user?.username || '',
      email: user?.email || '',
      zodiacSign: user?.zodiacSign || '',
      birthdate: user?.birthdate ? user.birthdate.split('T')[0] : '',
      language: language,
    },
  });

  useEffect(() => {
    form.reset({
      username: user?.username || '',
      email: user?.email || '',
      zodiacSign: user?.zodiacSign || '',
      birthdate: user?.birthdate ? user.birthdate.split('T')[0] : '',
      language: language,
    });
  }, [user, language, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const profileData: Partial<z.infer<typeof formSchema>> = {
        ...values,
        birthdate: values.birthdate || null,
      };
      delete profileData.language;
      delete profileData.email; // Email cannot be updated from here
      await updateProfile(profileData);
      toast({
        title: t('profile_update_success_title'),
        description: t('profile_update_success_description'),
      });
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Extract detailed error information
      let errorMessage = 'Failed to update profile.';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check if it's a Firebase error
        if (error.name === 'FirebaseError' || error.message.includes('permission') || error.message.includes('Permission')) {
          errorDetails = `Permission Error: ${error.message}\n\nPlease ensure:\n1. You are logged in\n2. Firestore rules allow updates to your user document\n3. Your user document exists in Firestore`;
        } else {
          errorDetails = error.message;
        }
      }
      
      toast({
        variant: 'destructive',
        title: t('profile_update_fail_title'),
        description: errorDetails || errorMessage,
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    toast({
      title: t('logout_success_title'),
      description: t('logout_success_description'),
    });
  };

  const deleteAccountSystemPrompt = `Please delete my Cielo account.

Account details:
- Email: ${user?.email || 'Unknown'}
- User ID: ${user?.uid || 'Unknown'}
- Requested at: ${new Date().toISOString()}

Deletion reason:
${deleteReason.trim() || 'No reason provided.'}

Suggestions to improve the app:
${deleteSuggestions.trim() || 'No suggestions provided.'}

This request was initiated from the Cielo Profile & Settings page.`;

  const deleteAccountMailto = `mailto:cs@cjhadisa.com?subject=${encodeURIComponent(
    'Account deletion request'
  )}&body=${encodeURIComponent(deleteAccountSystemPrompt)}`;

  const handleDeleteAccount = async () => {
    if (deleteConfirm.trim().toUpperCase() !== 'DELETE') {
      toast({
        variant: 'destructive',
        title: 'Confirmation required',
        description: 'Type DELETE to confirm account removal.',
      });
      return;
    }

    setIsDeleting(true);
    try {
      window.open(deleteAccountMailto, '_blank');
      await deleteAccount();
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently removed.',
      });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cielo:accountDeleted', '1');
      }
      router.push('/signup?deleted=1');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account.';
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          {t('profile_title')}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base md:text-lg mt-1">
          {t('profile_description')}
        </p>
      </div>

      <Card className="mx-auto mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>{t('profile_form_title')}</CardTitle>
          <CardDescription>{t('profile_form_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile_username')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('profile_username_placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile_email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                        disabled
                      />
                    </FormControl>
                     <FormDescription>
                      Your email address cannot be changed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zodiacSign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile_zodiac')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('profile_zodiac_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zodiacSigns.map(sign => (
                          <SelectItem key={sign} value={sign}>
                            {sign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('profile_zodiac_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile_birthdate')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('profile_birthdate_placeholder')}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('profile_birthdate_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile_language')}</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value);
                        setLanguage(value as Language);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('profile_language_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.key} value={lang.key}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading
                    ? t('profile_saving_button')
                    : t('profile_save_button')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                >
                  {t('profile_logout_button')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="mx-auto mt-6 max-w-2xl border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            This permanently removes your account and profile data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-reason">Why are you deleting your account?</Label>
            <Textarea
              id="delete-reason"
              value={deleteReason}
              onChange={event => setDeleteReason(event.target.value)}
              placeholder="Share your reason (optional)"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-suggestions">How can we make the app better?</Label>
            <Textarea
              id="delete-suggestions"
              value={deleteSuggestions}
              onChange={event => setDeleteSuggestions(event.target.value)}
              placeholder="Share suggestions (optional)"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
            <Input
              id="delete-confirm"
              value={deleteConfirm}
              onChange={event => setDeleteConfirm(event.target.value)}
              placeholder="DELETE"
            />
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
