import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { authApi, type AuthResponse } from '@/api/auth';
import { toast } from 'sonner';

interface User {
  userId: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try { return JSON.parse(savedUser); } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  const loginFn = useCallback(async (username: string, password: string) => {
    const res: AuthResponse = await authApi.login({ username, password });
    const userData: User = { userId: res.userId, username: res.username, role: res.role };
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    toast.success('登录成功');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login: loginFn,
    logout,
  }), [user, loginFn, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}