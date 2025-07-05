import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Patient, Doctor } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
    // Mock authentication - in production, this would be a real API call
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
    };

    if (role === 'patient') {
      const patient: Patient = {
        ...mockUser,
        role: 'patient',
        dueDate: '2024-08-15',
        currentWeek: 24,
        emergencyContacts: [
          {
            id: '1',
            name: 'John Doe',
            phone: '+1234567890',
            relationship: 'Spouse'
          }
        ]
      };
      setUser(patient);
    } else {
      const doctor: Doctor = {
        ...mockUser,
        role: 'doctor',
        specialization: 'Obstetrics and Gynecology',
        license: 'MD123456',
        patients: []
      };
      setUser(doctor);
    }

    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsAuthenticated(true);
  };

  const signup = async (email: string, password: string, name: string, role: 'patient' | 'doctor') => {
    // Mock signup - in production, this would be a real API call
    await login(email, password, role);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};