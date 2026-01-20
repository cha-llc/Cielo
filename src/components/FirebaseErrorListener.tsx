'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * Listens for Firestore permission errors and shows them as toasts
 * instead of crashing the entire application.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Show a user-friendly message in the UI
      toast({
        variant: 'destructive',
        title: 'Permission denied',
        description:
          'You are not allowed to perform this action. Please check your Firestore rules or contact support.',
      });

      // Also log full error in console for developers
      // (includes the detailed rules request JSON)
      // eslint-disable-next-line no-console
      console.error(error);
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
