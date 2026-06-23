
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin } from '@/lib/adminAuthApi';

// Define the user type with isAdmin property
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean; // Add isAdmin property to context
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false, // Add default value for isAdmin
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a user in localStorage (simulating persisted auth)
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await adminLogin(email, password);
      const { user: adminUser, token } = response;

      const mappedUser: User = {
        id: String(adminUser.id),
        name: [adminUser.first_name, adminUser.last_name].filter(Boolean).join(' ') || adminUser.username,
        email: adminUser.email,
        role: 'admin',
        isAdmin: adminUser.is_staff || adminUser.is_superuser || adminUser.is_admin,
      };

      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      localStorage.setItem('admin_token', token);

      // Redirect to dashboard or the page they were trying to access
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.isAdmin || false, // Add isAdmin derived from user
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
