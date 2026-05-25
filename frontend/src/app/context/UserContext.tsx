"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

interface UserContextProps {
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Admin',
  avatarInitials: 'AD',
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser({ ...defaultUser, ...parsed });
      } catch (_) {}
    }
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem('userProfile', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
