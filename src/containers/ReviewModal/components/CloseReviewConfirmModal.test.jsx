import { shallow } from '@edx/react-unit-test-utils';

import { CloseReviewConfirmModal } from './CloseReviewConfirmModal';

jest.mock('components/ConfirmModal', () => 'ConfirmModal');

describe('CloseReviewConfirmModal', () => {
  const props = {
    isOpen: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };

  describe('snapshot', () => {
    test('closed', () => {
      expect(shallow(<CloseReviewConfirmModal {...props} />).snapshot).toMatchSnapshot();
    });
    test('open', () => {
      expect(shallow(<CloseReviewConfirmModal {...props} isOpen />).snapshot).toMatchSnapshot();
    });
  });
});
