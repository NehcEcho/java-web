import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { authApi } from '@/api/auth';

function TestComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.username : 'no-user'}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <button data-testid="login-btn" onClick={() => login('testuser', 'pass123')}>Login</button>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider(ui: ReactNode) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe('AuthProvider and useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initial state shows not authenticated and no user', () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('admin').textContent).toBe('false');
  });

  it('login stores token and sets user', async () => {
    const mockResponse = {
      token: 'jwt-token-abc',
      userId: 1,
      username: 'testuser',
      role: 'USER',
    };
    vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse);

    renderWithProvider(<TestComponent />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    expect(localStorage.getItem('token')).toBe('jwt-token-abc');
    expect(localStorage.getItem('user')).toBe(JSON.stringify({
      userId: 1,
      username: 'testuser',
      role: 'USER',
    }));
    expect(screen.getByTestId('user').textContent).toBe('testuser');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('logout clears token and user', async () => {
    const mockResponse = {
      token: 'jwt-token-abc',
      userId: 1,
      username: 'testuser',
      role: 'USER',
    };
    vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse);

    renderWithProvider(<TestComponent />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    expect(screen.getByTestId('user').textContent).toBe('testuser');

    await user.click(screen.getByTestId('logout-btn'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });

  it('isAdmin is true for ADMIN role', async () => {
    const mockResponse = {
      token: 'jwt-admin-token',
      userId: 2,
      username: 'adminuser',
      role: 'ADMIN',
    };
    vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse);

    renderWithProvider(<TestComponent />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    expect(screen.getByTestId('admin').textContent).toBe('true');
  });

  it('isAdmin is false for USER role', async () => {
    const mockResponse = {
      token: 'jwt-user-token',
      userId: 3,
      username: 'normaluser',
      role: 'USER',
    };
    vi.mocked(authApi.login).mockResolvedValueOnce(mockResponse);

    renderWithProvider(<TestComponent />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId('login-btn'));

    expect(screen.getByTestId('admin').textContent).toBe('false');
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('token', 'saved-token');
    localStorage.setItem('user', JSON.stringify({
      userId: 5,
      username: 'saveduser',
      role: 'USER',
    }));

    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId('user').textContent).toBe('saveduser');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('admin').textContent).toBe('false');
  });

  it('useAuth outside provider throws', () => {
    function BadComponent() {
      expect(() => useAuth()).toThrow('useAuth must be used within AuthProvider');
      return null;
    }

    render(<BadComponent />);
  });
});
