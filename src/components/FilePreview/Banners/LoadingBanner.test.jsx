import { render, screen } from '@testing-library/react';
import LoadingBanner from './LoadingBanner';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Loading Banner component', () => {
  describe('behavior', () => {
    it('renders an info alert', () => {
      render(<LoadingBanner />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert-info');
    });

    it('renders a spinner', () => {
      const { container } = render(<LoadingBanner />);
      const spinner = container.querySelector('.pgn__spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('spinner-border');
    });
  });
});
