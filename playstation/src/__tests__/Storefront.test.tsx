import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from '@/pages/HomePage';

vi.mock('@/hooks/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'fabric-user', email: 'player@example.com', name: 'Player' },
    signOut: vi.fn(),
  }),
}));

describe('PlayStation Store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the UAE sale hero and live catalogue', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /summer sale/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /top 10 games in your country/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view grand theft auto vi details/i })).toBeInTheDocument();
  });

  it('searches games and opens a full game detail panel', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /search store/i }));
    await user.type(screen.getByRole('textbox', { name: /search playstation store/i }), 'Halo');
    await user.click(screen.getByRole('button', { name: /view halo: campaign evolved details/i }));

    expect(screen.getByRole('dialog', { name: /halo: campaign evolved details/i })).toBeInTheDocument();
    expect(screen.getByText(/legendary campaign arrives on playstation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('adds a selected game to the shopping bag', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /view grand theft auto vi details/i }));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('button', { name: /bag 1/i }));

    const bag = screen.getByLabelText(/shopping bag/i);
    expect(bag).toBeInTheDocument();
    expect(within(bag).getByText('Grand Theft Auto VI')).toBeInTheDocument();
    expect(within(bag).getAllByText('$99.99')).toHaveLength(2);
  });
});
