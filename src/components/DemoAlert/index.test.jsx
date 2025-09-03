import { fireEvent } from '@testing-library/react';
import { renderWithIntl } from '../../testUtils';

import messages from './messages';
import { DemoAlert } from '.';

describe('DemoAlert component', () => {
  const props = {
    isOpen: true,
    onClose: jest.fn().mockName('props.onClose'),
  };

  it('does not render when isOpen is false', () => {
    const { queryByText } = renderWithIntl(<DemoAlert {...props} isOpen={false} />);
    expect(queryByText(messages.title.defaultMessage)).toBeNull();
  });

  it('renders with correct title and message when isOpen is true', () => {
    const { getByText } = renderWithIntl(<DemoAlert {...props} />);
    expect(getByText(messages.title.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.warningMessage.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when confirmation button is clicked', () => {
    const { getByText } = renderWithIntl(<DemoAlert {...props} />);
    const confirmButton = getByText(messages.confirm.defaultMessage);
    fireEvent.click(confirmButton);
    expect(props.onClose).toHaveBeenCalled();
  });
});
