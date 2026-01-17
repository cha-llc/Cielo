'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

type User = {
  username: string;
  email: string;
  isUpgraded: boolean;
  zodiacSign: string | null;
  birthdate: string | null;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (username: string, email: string, pass:string) => Promise<void>;
  logout: () => Promise<void>;
  upgrade: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cielo-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error)
        localStorage.removeItem('cielo-user');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<void> => {
    // Mock login
    if (email && pass) {
      const mockUser: User = {
        username: 'Stardust',
        email: email,
        isUpgraded: false,
        zodiacSign: null,
        birthdate: null,
      };
      localStorage.setItem('cielo-user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }
    throw new Error('Invalid email or password');
  }, []);

  const signup = useCallback(async (username: string, email: string, pass: string): Promise<void> => {
    // Mock signup - in a real app, this would hit an API endpoint
    if (username && email && pass) {
        // Just resolve, user can now login
        return;
    }
    throw new Error('Please fill all fields');
  }, []);


  const logout = useCallback(async (): Promise<void> => {
    localStorage.removeItem('cielo-user');
    setUser(null);
  }, []);

  const upgrade = useCallback(async (): Promise<void> => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const upgradedUser = { ...prevUser, isUpgraded: true };
      localStorage.setItem('cielo-user', JSON.stringify(upgradedUser));
      return upgradedUser;
    });
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...data };
      localStorage.setItem('cielo-user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = {
    isLoggedIn: !!user,
    isLoading,
    user,
    login,
    signup,
    logout,
    upgrade,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
