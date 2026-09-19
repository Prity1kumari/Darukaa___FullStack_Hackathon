import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../src/pages/LoginPage';
import { AuthProvider } from '../src/context/AuthContext';

describe('LoginPage Component', () => {
  it('renders login form elements and fills demo credentials', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /sign in to console/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@darukaa\.earth/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();

    // Click Fill Demo Credentials
    const demoButton = screen.getByText(/fill default admin credentials/i);
    fireEvent.click(demoButton);

    const emailInput = screen.getByPlaceholderText(/admin@darukaa\.earth/i) as HTMLInputElement;
    expect(emailInput.value).toBe('admin@darukaa.earth');
  });
});
