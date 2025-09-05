import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../../testUtils';
import ErrorBanner from './ErrorBanner';
import messages from '../messages';

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
      renderWithIntl(<ErrorBanner {...props} />);
      const childText = screen.getByText('Abitary Child');
      expect(childText).toBeInTheDocument();
    });

    it('renders the correct number of action buttons', () => {
      renderWithIntl(<ErrorBanner {...props} />);
      const buttons = screen.getAllByText(messages.retryButton.defaultMessage);
      expect(buttons).toHaveLength(2);
    });

    it('renders error heading with correct message', () => {
      renderWithIntl(<ErrorBanner {...props} />);
      const heading = screen.getAllByText(messages.unknownError.defaultMessage)[0];
      expect(heading).toBeInTheDocument();
    });

    it('renders with danger variant', () => {
      renderWithIntl(<ErrorBanner {...props} />);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert-danger');
    });
  });
});
