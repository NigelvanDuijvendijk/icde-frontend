import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthenticationToken, Ontwikkelaar } from '../types/types';
import axios from 'axios';

interface AuthContextType {
  user: Partial<Ontwikkelaar> | undefined;
  setUser: React.Dispatch<React.SetStateAction<Partial<Ontwikkelaar> | undefined>>;
  authenticationToken: AuthenticationToken | undefined;
  setAuthenticationToken: React.Dispatch<React.SetStateAction<AuthenticationToken | undefined>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Partial<Ontwikkelaar> | undefined>(undefined);
  const [authenticationToken, setAuthenticationToken] = useState<AuthenticationToken | undefined>(undefined);

const logout = () => {
    setUser(undefined);
    setAuthenticationToken(undefined);
    localStorage.removeItem("user");
    localStorage.removeItem("authenticationToken");
    delete axios.defaults.headers.common['Authorization'];
}

useEffect(() => {
    const tokenstorage = localStorage.getItem("authenticationToken");
    if (tokenstorage) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(tokenstorage).token}`;
        setAuthenticationToken(JSON.parse(tokenstorage));
    }

    const userstorage = localStorage.getItem("user");
    if (userstorage) {
        setUser(JSON.parse(userstorage));
    }
}, []);


useEffect(() => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    if (authenticationToken) {
        localStorage.setItem("authenticationToken", JSON.stringify(authenticationToken));
    }
}, [user, authenticationToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, authenticationToken, setAuthenticationToken, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};