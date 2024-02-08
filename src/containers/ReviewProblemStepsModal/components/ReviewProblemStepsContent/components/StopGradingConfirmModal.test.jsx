import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { StopGradingConfirmModal } from './StopGradingConfirmModal';

jest.mock('components/ConfirmModal', () => 'ConfirmModal');

describe('StopGradingConfirmModal', () => {
  const props = {
    intl: { formatMessage },
    isOpen: false,
    isOverride: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };
  test('snapshot: closed', () => {
    expect(shallow(<StopGradingConfirmModal {...props} />)).toMatchSnapshot();
  });
  test('snapshot: open', () => {
    expect(shallow(<StopGradingConfirmModal {...props} isOpen />)).toMatchSnapshot();
  });
  test('snapshot: open, isOverride', () => {
    expect(shallow(<StopGradingConfirmModal {...props} isOverride />)).toMatchSnapshot();
  });
});
