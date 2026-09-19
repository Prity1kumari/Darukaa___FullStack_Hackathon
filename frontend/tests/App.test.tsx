import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Root Component', () => {
  it('renders application and routes unauthenticated users to login', async () => {
    render(<App />);
    expect(await screen.findByText(/darukaa/i)).toBeInTheDocument();
    expect(await screen.findByText(/sign in to console/i)).toBeInTheDocument();
  });
});
