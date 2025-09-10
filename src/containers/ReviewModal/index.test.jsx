import { useDispatch } from 'react-redux';
import { screen } from '@testing-library/react';

import * as hooks from './hooks';
import { ReviewModal } from '.';
import messages from './messages';
import { renderWithIntl } from '../../testUtils';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  connect: jest.fn(() => (Component) => Component),
}));

jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(),
}));

jest.mock('containers/ReviewModal/ReviewContent', () => {
  const ReviewContent = () => <div>ReviewContent</div>;
  return ReviewContent;
});

jest.mock('containers/ReviewActions', () => {
  const ReviewActions = () => <div>ReviewActions</div>;
  return ReviewActions;
});

jest.mock('containers/DemoWarning', () => {
  const DemoWarning = () => <div>DemoWarning</div>;
  return DemoWarning;
});

jest.mock('containers/ReviewModal/components/CloseReviewConfirmModal', () => {
  const CloseReviewConfirmModal = () => <div>CloseReviewConfirmModal</div>;
  return CloseReviewConfirmModal;
});

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

    renderWithIntl(<ReviewModal />);

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

    renderWithIntl(<ReviewModal />);
    expect(useDispatch).toHaveBeenCalled();
  });

  it('renders correctly when open', () => {
    hooks.rendererHooks.mockReturnValue({
      isLoading: false,
      title: 'test-ora-name',
      onClose: jest.fn(),
      isOpen: true,
      closeConfirmModalProps: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });

    renderWithIntl(<ReviewModal />);
    const reviewActions = screen.getByText('ReviewActions');
    expect(reviewActions).toBeInTheDocument();

    const demoWarning = screen.getByText('DemoWarning');
    expect(demoWarning).toBeInTheDocument();

    const reviewContent = screen.getByText('ReviewContent');
    expect(reviewContent).toBeInTheDocument();

    const closeReviewConfirmModal = screen.getByText('CloseReviewConfirmModal');
    expect(closeReviewConfirmModal).toBeInTheDocument();
  });

  it('renders correctly loading message', () => {
    hooks.rendererHooks.mockReturnValue({
      isLoading: true,
      title: 'test-ora-name',
      onClose: jest.fn(),
      isOpen: true,
      closeConfirmModalProps: {
        isOpen: false,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
      },
    });

    renderWithIntl(<ReviewModal />);
    const loadingMessage = screen.getByText(messages.loadingResponse.defaultMessage);
    expect(loadingMessage).toBeInTheDocument();
  });
});
