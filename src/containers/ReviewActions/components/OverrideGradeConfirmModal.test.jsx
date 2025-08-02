import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import OverrideGradeConfirmModal from './OverrideGradeConfirmModal';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const renderWithIntl = (component) => render(
  <IntlProvider locale="en">
    {component}
  </IntlProvider>,
);

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
    const { queryByText } = renderWithIntl(<OverrideGradeConfirmModal {...props} />);
    expect(queryByText('This cannot be undone')).toBeNull();
  });

  it('should display content when modal is open', () => {
    const { getByText } = renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    expect(getByText('Are you sure you want to override this grade?')).toBeInTheDocument();
    expect(getByText(/This cannot be undone.*The learner may have already received their grade/)).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    fireEvent.click(screen.getByText('Go back'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked', () => {
    renderWithIntl(<OverrideGradeConfirmModal {...props} isOpen />);
    fireEvent.click(screen.getByText('Continue grade override'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
