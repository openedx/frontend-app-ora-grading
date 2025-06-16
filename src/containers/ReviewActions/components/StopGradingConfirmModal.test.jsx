import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import StopGradingConfirmModal from './StopGradingConfirmModal';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const renderWithIntl = (component) => render(
  <IntlProvider locale="en">
    {component}
  </IntlProvider>,
);

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

  it('should call onCancel when cancel button is clicked', () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen />);
    fireEvent.click(screen.getByText('Go back'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked for regular grading', () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen />);
    fireEvent.click(screen.getByText('Cancel grading'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when confirm button is clicked for override', () => {
    renderWithIntl(<StopGradingConfirmModal {...props} isOpen isOverride />);
    fireEvent.click(screen.getByText('Stop grade override'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
