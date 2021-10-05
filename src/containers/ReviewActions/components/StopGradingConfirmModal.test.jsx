import { shallow } from 'enzyme';

import { StopGradingConfirmModal } from './StopGradingConfirmModal';

jest.mock('components/ConfirmModal', () => 'ConfirmModal');

describe('StopGradingConfirmModal', () => {
  const props = {
    isOpen: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };
  test('snapshot: closed', () => {
    expect(shallow(<StopGradingConfirmModal {...props} />)).toMatchSnapshot();
  });
  test('snapshot: open', () => {
    expect(shallow(<StopGradingConfirmModal {...props} isOpen />)).toMatchSnapshot();
  });
});
