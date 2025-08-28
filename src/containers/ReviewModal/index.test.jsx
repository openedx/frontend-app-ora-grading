import { useDispatch } from 'react-redux';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

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

    render(<IntlProvider locale="en" messages={{}}><ReviewModal /></IntlProvider>);

    expect(hooks.rendererHooks).toHaveBeenCalledWith({
      dispatch: mockDispatch,
      intl: expect.any(Object),
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

    render(<IntlProvider locale="en" messages={{}}><ReviewModal /></IntlProvider>);

    expect(useDispatch).toHaveBeenCalled();
  });
});
