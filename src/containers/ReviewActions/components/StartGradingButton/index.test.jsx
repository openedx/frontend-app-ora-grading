import { screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { renderWithIntl } from '../../../../testUtils';
import * as hooks from './hooks';
import { StartGradingButton } from '.';
import messages from '../messages';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('./hooks', () => ({
  buttonHooks: jest.fn(),
}));

describe('StartGradingButton', () => {
  const mockDispatch = jest.fn();

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
    const button = screen.getByRole('button', { name: 'Start Grading' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  it('renders override grade modal components', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: false,
      buttonArgs: { children: 'Start Grading' },
      overrideGradeArgs: {
        isOpen: true,
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
    const overrideModalTitle = screen.getByText(messages.overrideConfirmTitle.defaultMessage);
    expect(overrideModalTitle).toBeInTheDocument();
  });

  it('renders stop grading modal components', () => {
    hooks.buttonHooks.mockReturnValue({
      hide: false,
      buttonArgs: { children: 'Start Grading' },
      overrideGradeArgs: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
      stopGradingArgs: {
        isOpen: true,
        isOverride: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });
    renderWithIntl(<StartGradingButton />);
    const stopGradingModalTitle = screen.getByText(messages.confirmStopGradingTitle.defaultMessage);
    expect(stopGradingModalTitle).toBeInTheDocument();
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
