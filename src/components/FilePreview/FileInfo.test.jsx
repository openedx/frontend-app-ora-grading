import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../testUtils';

import FileInfo from './FileInfo';
import messages from './messages';

describe('FileInfo component', () => {
  const children = (<h1>some Children</h1>);
  const props = { onClick: jest.fn().mockName('this.props.onClick') };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('renders the FileInfo button with correct text', () => {
      renderWithIntl(<FileInfo {...props}>{children}</FileInfo>);
      expect(screen.getByText(messages.fileInfo.defaultMessage)).toBeInTheDocument();
    });

    it('calls onClick when button is clicked', async () => {
      renderWithIntl(<FileInfo {...props}>{children}</FileInfo>);
      const user = userEvent.setup();
      await user.click(screen.getByText(messages.fileInfo.defaultMessage));
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
