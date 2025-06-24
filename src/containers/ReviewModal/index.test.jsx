import { useDispatch } from 'react-redux';
import * as hooks from './hooks';
import { ReviewModal } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  connect: jest.fn(() => (Component) => Component),
}));

jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(),
}));

describe('ReviewModal', () => {
  const mockDispatch = jest.fn();
  const defaultProps = {
    intl: {
      formatMessage: jest.fn((message) => message.defaultMessage || message.id),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  it('calls rendererHooks with dispatch and intl', () => {
    hooks.rendererHooks.mockReturnValue({
      isLoading: false,
      title: 'test-ora-name',
      onClose: jest.fn(),
      isOpen: false,
      closeConfirmModalProps: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });

    ReviewModal(defaultProps);

    expect(hooks.rendererHooks).toHaveBeenCalledWith({
      dispatch: mockDispatch,
      intl: defaultProps.intl,
    });
  });

  it('calls useDispatch hook', () => {
    hooks.rendererHooks.mockReturnValue({
      isLoading: false,
      title: 'test-ora-name',
      onClose: jest.fn(),
      isOpen: false,
      closeConfirmModalProps: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });

    ReviewModal(defaultProps);

    expect(useDispatch).toHaveBeenCalled();
  });
});
