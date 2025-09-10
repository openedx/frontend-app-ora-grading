import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../../testUtils';
import OverrideGradeConfirmModal from './OverrideGradeConfirmModal';

describe('OverrideGradeConfirmModal', () => {
  const props = {
    isOpen: false,
    onCancel: jest.fn().mockName('this.props.onCancel'),
    onConfirm: jest.fn().mockName('this.props.onConfirm'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render content when modal is closed', () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} />);
    expect(screen.queryByText('This cannot be undone')).toBeNull();
  });

  it('should display content when modal is open', () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    expect(screen.getByText('Are you sure you want to override this grade?')).toBeInTheDocument();
    expect(screen.getByText(/This cannot be undone.*The learner may have already received their grade/)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Go back'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Continue grade override'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
