import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../src/components/common/StatCard';
import { Trees } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders title, value, and unit correctly', () => {
    render(
      <StatCard
        title="Monitored Hectares"
        value="12,450"
        unit="ha"
        change={8.5}
        icon={<Trees data-testid="trees-icon" />}
      />
    );

    expect(screen.getByText('Monitored Hectares')).toBeInTheDocument();
    expect(screen.getByText('12,450')).toBeInTheDocument();
    expect(screen.getByText('ha')).toBeInTheDocument();
    expect(screen.getByText('8.5%')).toBeInTheDocument();
  });

  it('renders negative change with correct indicator', () => {
    render(
      <StatCard
        title="Canopy Deficit"
        value="420"
        change={-3.2}
        icon={<Trees />}
      />
    );

    expect(screen.getByText('3.2%')).toBeInTheDocument();
  });
});
