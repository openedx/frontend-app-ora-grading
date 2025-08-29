import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import ReviewError from './ReviewError';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('ReviewError component', () => {
  const messages = {
    heading: {
      id: 'test-header-message',
      defaultMessage: 'Test Header Message',
    },
    cancel: {
      id: 'test-cancel-message',
      defaultMessage: 'Test Cancel Message',
    },
    confirm: {
      id: 'test-confirm-message',
      defaultMessage: 'Test Confirm Message',
    },
  };

  const cancel = {
    onClick: jest.fn(),
    message: messages.cancel,
  };

  const confirm = {
    onClick: jest.fn(),
    message: messages.confirm,
  };

  const defaultProps = {
    headingMessage: messages.heading,
  };

  const children = 'Test error content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders alert with heading and children', () => {
    renderWithIntl(<ReviewError {...defaultProps}>{children}</ReviewError>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test Header Message')).toBeInTheDocument();
    expect(screen.getByText('Test error content')).toBeInTheDocument();
  });

  it('renders with default danger variant', () => {
    renderWithIntl(<ReviewError {...defaultProps}>{children}</ReviewError>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-danger');
  });

  it('renders with custom variant', () => {
    renderWithIntl(<ReviewError {...defaultProps} variant="warning">{children}</ReviewError>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-warning');
  });

  it('renders cancel button when cancel action provided', () => {
    renderWithIntl(<ReviewError {...defaultProps} actions={{ cancel }}>{children}</ReviewError>);
    const cancelButton = screen.getByText('Test Cancel Message');
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.closest('button')).toHaveClass('btn-outline-primary');
  });

  it('renders confirm button when confirm action provided', () => {
    renderWithIntl(<ReviewError {...defaultProps} actions={{ confirm }}>{children}</ReviewError>);
    const confirmButton = screen.getByText('Test Confirm Message');
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton.closest('button')).toHaveClass('btn-primary');
  });

  it('renders both cancel and confirm buttons when both actions provided', () => {
    renderWithIntl(<ReviewError {...defaultProps} actions={{ cancel, confirm }}>{children}</ReviewError>);
    expect(screen.getByText('Test Cancel Message')).toBeInTheDocument();
    expect(screen.getByText('Test Confirm Message')).toBeInTheDocument();
  });

  it('calls cancel onClick when cancel button is clicked', async () => {
    renderWithIntl(<ReviewError {...defaultProps} actions={{ cancel }}>{children}</ReviewError>);
    const user = userEvent.setup();
    const cancelButton = screen.getByText('Test Cancel Message');
    await user.click(cancelButton);
    expect(cancel.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls confirm onClick when confirm button is clicked', async () => {
    renderWithIntl(<ReviewError {...defaultProps} actions={{ confirm }}>{children}</ReviewError>);
    const user = userEvent.setup();
    const confirmButton = screen.getByText('Test Confirm Message');
    await user.click(confirmButton);
    expect(confirm.onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    renderWithIntl(<ReviewError {...defaultProps} className="custom-class">{children}</ReviewError>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});
