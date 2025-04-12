
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  user_type: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('shamaUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem('shamaUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API call in production
      // In a real app, this would be an API call to your backend
      if (email === 'admin@shamachallenge.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          username: 'admin',
          email: 'admin@shamachallenge.com',
          user_type: 'admin'
        };
        setUser(userData);
        localStorage.setItem('shamaUser', JSON.stringify(userData));
        toast.success("Welcome back, Admin!");
      } else {
        toast.error("Invalid credentials or not an admin account");
        throw new Error("Invalid credentials or not an admin account");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shamaUser');
    toast.info("You've been logged out");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.user_type === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
