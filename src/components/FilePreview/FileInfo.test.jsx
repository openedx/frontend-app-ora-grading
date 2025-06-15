import { render, screen, fireEvent } from '@testing-library/react';

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

    it('calls onClick when button is clicked', () => {
      render(<FileInfo {...props}>{children}</FileInfo>);

      fireEvent.click(screen.getByText('FormattedMessage'));
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
