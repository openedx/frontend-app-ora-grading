import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { OverrideGradeConfirmModal } from './OverrideGradeConfirmModal';

jest.mock('components/ConfirmModal', () => 'ConfirmModal');

describe('OverrideGradeConfirmModal', () => {
  const props = {
    intl: { formatMessage },
    isOpen: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };
  test('snapshot: closed', () => {
    expect(shallow(<OverrideGradeConfirmModal {...props} />)).toMatchSnapshot();
  });
  test('snapshot: open', () => {
    expect(shallow(<OverrideGradeConfirmModal {...props} isOpen />)).toMatchSnapshot();
  });
});
