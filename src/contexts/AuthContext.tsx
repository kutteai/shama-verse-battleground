
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin } from '@/lib/adminAuthApi';
import { getSavedUser, redirectToLogin, saveSession, safeReturnPath } from '@/lib/session';

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
    // Restore the session only when both the user and the token are saved.
    setUser(getSavedUser<User>());
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
      saveSession(token, mappedUser);

      // Back to the page they were on (route guard or expired session), else the dashboard.
      const next = new URLSearchParams(location.search).get('next');
      const origin =
        safeReturnPath(location.state?.from?.pathname) ?? safeReturnPath(next) ?? '/dashboard';
      navigate(origin, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Full page load: clears cached data and any open menu (navigating from
    // inside the closing dropdown could leave the page unclickable).
    redirectToLogin();
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
