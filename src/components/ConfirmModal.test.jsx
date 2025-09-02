import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from './ConfirmModal';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('ConfirmModal', () => {
  const props = {
    isOpen: false,
    title: 'test-title',
    cancelText: 'test-cancel-text',
    confirmText: 'test-confirm-text',
    content: 'test-content',
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render content when modal is closed', () => {
    const { queryByText } = render(<ConfirmModal {...props} />);
    expect(queryByText(props.content)).toBeNull();
  });

  it('should display content when modal is open', () => {
    const { getByText } = render(<ConfirmModal {...props} isOpen />);
    expect(getByText(props.content)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<ConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText(props.cancelText));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    render(<ConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText(props.confirmText));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
