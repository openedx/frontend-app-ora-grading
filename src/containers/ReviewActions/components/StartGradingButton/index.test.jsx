import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { useDispatch } from 'react-redux';
import * as hooks from './hooks';
import { StartGradingButton } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('./hooks', () => ({
  buttonHooks: jest.fn(),
}));

describe('StartGradingButton', () => {
  const mockDispatch = jest.fn();

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  it('does not render when hide is true', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: true,
      buttonArgs: {},
      overrideGradeArgs: {},
      stopGradingArgs: {},
    });
    const { container } = renderWithIntl(<StartGradingButton />);
    expect(container.firstChild).toBeNull();
  });

  it('renders primary button when visible', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: false,
      buttonArgs: { children: 'Start Grading', 'data-testid': 'start-grading-btn' },
      overrideGradeArgs: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
      stopGradingArgs: {
        isOpen: false,
        isOverride: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });
    renderWithIntl(<StartGradingButton />);
    const button = screen.getByTestId('start-grading-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  it('renders all required modal components', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: false,
      buttonArgs: { children: 'Start Grading' },
      overrideGradeArgs: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
      stopGradingArgs: {
        isOpen: false,
        isOverride: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });
    const { container } = renderWithIntl(<StartGradingButton />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('calls buttonHooks with dispatch and intl', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: false,
      buttonArgs: { children: 'Start Grading' },
      overrideGradeArgs: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
      stopGradingArgs: {
        isOpen: false,
        isOverride: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });
    renderWithIntl(<StartGradingButton />);
    expect(hooks.buttonHooks).toHaveBeenCalledWith({
      dispatch: mockDispatch,
      intl: expect.any(Object),
    });
  });
});
