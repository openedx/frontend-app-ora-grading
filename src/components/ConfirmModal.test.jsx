import { render } from '@testing-library/react';
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
  it('should not render content when modal is closed', () => {
    const { queryByText } = render(<ConfirmModal {...props} />);
    expect(queryByText(props.content)).toBeNull();
  });
  it('should display content when modal is open', () => {
    const { getByText } = render(<ConfirmModal {...props} isOpen />);
    expect(getByText(props.content)).toBeInTheDocument();
  });
});
