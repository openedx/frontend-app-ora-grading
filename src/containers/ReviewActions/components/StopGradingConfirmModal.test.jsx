import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../../testUtils';
import StopGradingConfirmModal from './StopGradingConfirmModal';

describe('StopGradingConfirmModal', () => {
  const props = {
    isOpen: false,
    isOverride: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render content when modal is closed', () => {
    const { queryByText } = renderWithIntl(<StopGradingConfirmModal {...props} />);
    expect(queryByText('Your progress will be lost.')).toBeNull();
  });

  it('should display stop grading content when modal is open', () => {
    const { getByText } = renderWithIntl(<StopGradingConfirmModal {...props} isOpen />);
    expect(getByText('Are you sure you want to stop grading this response?')).toBeInTheDocument();
    expect(getByText('Your progress will be lost.')).toBeInTheDocument();
  });

  it('should display stop override content when modal is open and isOverride is true', () => {
    const { getByText } = renderWithIntl(<StopGradingConfirmModal {...props} isOpen isOverride />);
    expect(getByText('Are you sure you want to stop grade override?')).toBeInTheDocument();
    expect(getByText('Your progress will be lost.')).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Go back'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked for regular grading', async () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Cancel grading'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked for override', async () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen isOverride />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Stop grade override'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
