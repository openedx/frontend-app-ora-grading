import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../testUtils';

import messages from './messages';
import { DemoAlert } from '.';

describe('DemoAlert component', () => {
  const props = {
    isOpen: true,
    onClose: jest.fn().mockName('props.onClose'),
  };

  it('does not render when isOpen is false', () => {
    renderWithIntl(<DemoAlert {...props} isOpen={false} />);
    expect(screen.queryByText(messages.title.defaultMessage)).toBeNull();
  });

  it('renders with correct title and message when isOpen is true', () => {
    renderWithIntl(<DemoAlert {...props} />);
    expect(screen.getByText(messages.title.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.warningMessage.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when confirmation button is clicked', async () => {
    renderWithIntl(<DemoAlert {...props} />);
    const user = userEvent.setup();
    const confirmButton = screen.getByText(messages.confirm.defaultMessage);
    await user.click(confirmButton);
    expect(props.onClose).toHaveBeenCalled();
  });
});
