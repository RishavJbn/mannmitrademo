"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  id: string;
  recoveryPhrase: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: () => User;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const adjectives = ["Brave", "Calm", "Wise", "Gentle", "Swift", "Bright", "Kind", "Silent", "Loyal", "Curious"];
const nouns = ["Lion", "River", "Owl", "Forest", "Mountain", "Star", "Eagle", "Voyager", "Dreamer", "Seeker"];
const wordList = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yuzu", "zucchini"];

const generateAnonymousName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
};

const generateAnonymousId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateRecoveryPhrase = () => {
    return Array.from({ length: 12 }, () => wordList[Math.floor(Math.random() * wordList.length)]).join(' ');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('anubhooti-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(() => {
    const newUser: User = {
      name: generateAnonymousName(),
      id: generateAnonymousId(),
      recoveryPhrase: generateRecoveryPhrase(),
    };
    localStorage.setItem('anubhooti-user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('anubhooti-user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
