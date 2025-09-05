import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../../testUtils';
import CloseReviewConfirmModal from './CloseReviewConfirmModal';

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
    renderWithIntl(<CloseReviewConfirmModal {...props} />);
    expect(screen.queryByText('This cannot be undone')).toBeNull();
  });

  it('should display content when modal is open', () => {
    renderWithIntl(<CloseReviewConfirmModal {...props} isOpen />);
    expect(screen.getByText('Are you sure you want to close this modal?')).toBeInTheDocument();
    expect(screen.getByText(/This cannot be undone.*This will discard unsaved work/)).toBeInTheDocument();
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
