import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileInfo from './FileInfo';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('FileInfo component', () => {
  const children = (<h1>some Children</h1>);
  const props = { onClick: jest.fn().mockName('this.props.onClick') };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('renders the FileInfo button with correct text', () => {
      render(<FileInfo {...props}>{children}</FileInfo>);

      expect(screen.getByText('FormattedMessage')).toBeInTheDocument();
    });

    it('calls onClick when button is clicked', async () => {
      render(<FileInfo {...props}>{children}</FileInfo>);
      const user = userEvent.setup();
      await user.click(screen.getByText('FormattedMessage'));
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
