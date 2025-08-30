import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CloseReviewConfirmModal from './CloseReviewConfirmModal';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('CloseReviewConfirmModal', () => {
  const props = {
    isOpen: false,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render content when modal is closed', () => {
    const { queryByText } = renderWithIntl(<CloseReviewConfirmModal {...props} />);
    expect(queryByText('This cannot be undone')).toBeNull();
  });

  it('should display content when modal is open', () => {
    const { getByText } = renderWithIntl(<CloseReviewConfirmModal {...props} isOpen />);
    expect(getByText('Are you sure you want to close this modal?')).toBeInTheDocument();
    expect(getByText(/This cannot be undone.*This will discard unsaved work/)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    renderWithIntl(<CloseReviewConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Go back'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    renderWithIntl(<CloseReviewConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Close Modal'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
