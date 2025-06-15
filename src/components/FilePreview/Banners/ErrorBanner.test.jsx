import { render, screen } from '@testing-library/react';
import ErrorBanner from './ErrorBanner';
import messages from '../messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Error Banner component', () => {
  const children = <p>Abitary Child</p>;

  const props = {
    actions: [
      {
        id: 'action1',
        onClick: jest.fn().mockName('action1.onClick'),
        message: messages.retryButton,
      },
      {
        id: 'action2',
        onClick: jest.fn().mockName('action2.onClick'),
        message: messages.retryButton,
      },
    ],
    headingMessage: messages.unknownError,
    children,
  };

  describe('behavior', () => {
    it('renders children content', () => {
      render(<ErrorBanner {...props} />);
      const childText = screen.getByText('Abitary Child');
      expect(childText).toBeInTheDocument();
    });

    it('renders the correct number of action buttons', () => {
      render(<ErrorBanner {...props} />);
      const buttons = screen.getAllByText('FormattedMessage');
      expect(buttons).toHaveLength(3);
    });

    it('renders error heading with correct message', () => {
      render(<ErrorBanner {...props} />);
      const heading = screen.getAllByText('FormattedMessage')[0];
      expect(heading).toBeInTheDocument();
    });

    it('renders with danger variant', () => {
      render(<ErrorBanner {...props} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert-danger');
    });
  });
});
