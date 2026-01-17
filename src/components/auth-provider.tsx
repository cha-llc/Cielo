'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  Auth,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirebase }from '@/firebase/provider';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


// This is the shape of the user profile data stored in Firestore
export type UserProfile = {
  uid: string;
  username: string;
  email: string;
  isUpgraded: boolean;
  zodiacSign: string | null;
  birthdate: string | null;
  createdAt: any; // Using 'any' for serverTimestamp
};

// This is the user object available in the AuthContext
type AppUser = Omit<UserProfile, 'createdAt' | 'uid'> & { uid: string };

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: AppUser | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

async function fetchUserProfile(
  firestore: Firestore,
  user: FirebaseUser
): Promise<AppUser | null> {
  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as UserProfile;
    // The user object we expose in the context is slightly different
    return {
      uid: data.uid,
      username: data.username,
      email: data.email,
      isUpgraded: data.isUpgraded,
      zodiacSign: data.zodiacSign,
      birthdate: data.birthdate,
    };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore, isUserLoading, user: firebaseUser } = useFirebase();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (firebaseUser && firestore) {
        setProfileLoading(true);
        try {
          const userProfile = await fetchUserProfile(firestore, firebaseUser);
          setAppUser(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setAppUser(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setAppUser(null);
        setProfileLoading(false);
      }
    };

    if (!isUserLoading) {
      syncUser();
    }
  }, [firebaseUser, firestore, isUserLoading]);


  const login = useCallback(
    async (email: string, pass: string): Promise<void> => {
      if (!auth) throw new Error('Firebase Auth not available');
      await signInWithEmailAndPassword(auth, email, pass);
    },
    [auth]
  );

  const signup = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<void> => {
      if (!auth || !firestore) throw new Error('Firebase services not available');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      const newUserProfile: UserProfile = {
        uid: user.uid,
        username,
        email,
        isUpgraded: false,
        zodiacSign: null,
        birthdate: null,
        createdAt: serverTimestamp(),
      };
      
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, newUserProfile);
    },
    [auth, firestore]
  );

  const logout = useCallback(async (): Promise<void> => {
    if (!auth) throw new Error('Firebase Auth not available');
    await signOut(auth);
  }, [auth]);

  const updateProfile = useCallback(
    async (data: Partial<AppUser>): Promise<void> => {
        if (!appUser || !firestore) throw new Error('User or Firestore not available');
        const userRef = doc(firestore, 'users', appUser.uid);
        updateDocumentNonBlocking(userRef, data);
        setAppUser(prev => prev ? { ...prev, ...data } : null);
    },
    [appUser, firestore]
  );

  const sendPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      if (!auth) throw new Error('Firebase Auth not available');
      await sendPasswordResetEmail(auth, email);
    },
    [auth]
  );

  const value = {
    isLoggedIn: !!appUser,
    isLoading: isUserLoading || isProfileLoading,
    user: appUser,
    login,
    signup,
    logout,
    updateProfile,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
