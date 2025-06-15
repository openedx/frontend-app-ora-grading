import { render, fireEvent } from '@testing-library/react';

import { formatMessage } from 'testUtils';
import messages from './messages';
import { DemoAlert } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('DemoAlert component', () => {
  const props = {
    intl: { formatMessage },
    isOpen: true,
    onClose: jest.fn().mockName('props.onClose'),
  };

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(<DemoAlert {...props} isOpen={false} />);
    expect(queryByText(formatMessage(messages.title))).toBeNull();
  });

  it('renders with correct title and message when isOpen is true', () => {
    const { getByText } = render(<DemoAlert {...props} />);
    expect(getByText(formatMessage(messages.title))).toBeInTheDocument();
    expect(getByText(formatMessage(messages.warningMessage))).toBeInTheDocument();
  });

  it('calls onClose when confirmation button is clicked', () => {
    const { getByText } = render(<DemoAlert {...props} />);
    const confirmButton = getByText(formatMessage(messages.confirm));
    fireEvent.click(confirmButton);
    expect(props.onClose).toHaveBeenCalled();
  });
});
