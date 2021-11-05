import { shallow } from 'enzyme';

import { ConfirmModal } from './ConfirmModal';

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
  test('snapshot: closed', () => {
    expect(shallow(<ConfirmModal {...props} />)).toMatchSnapshot();
  });
  test('snapshot: open', () => {
    expect(shallow(<ConfirmModal {...props} isOpen />)).toMatchSnapshot();
  });
});
