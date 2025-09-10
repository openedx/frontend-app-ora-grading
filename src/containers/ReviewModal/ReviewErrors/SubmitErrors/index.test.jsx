import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithIntl } from '../../../../testUtils';
import * as hooks from './hooks';
import { SubmitErrors } from '.';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(() => ({ show: false })),
}));

describe('SubmitErrors component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when show is false', () => {
    hooks.rendererHooks.mockReturnValueOnce({ show: false });
    const { container } = renderWithIntl(<SubmitErrors />);
    expect(container.firstChild).toBeNull();
  });

  it('renders ReviewError when show is true', () => {
    const mockHook = {
      show: true,
      reviewActions: {
        confirm: {
          onClick: jest.fn(),
          message: {
            id: 'ora-grading.ReviewModal.resubmitGrade',
            defaultMessage: 'Resubmit grate',
          },
        },
        cancel: {
          onClick: jest.fn(),
          message: {
            id: 'ora-grading.ReviewModal.dismiss',
            defaultMessage: 'Dismiss',
          },
        },
      },
      headingMessage: {
        id: 'ora-grading.ReviewModal.gradeNotSubmitted.heading',
        defaultMessage: 'Grade not submitted',
      },
      content: "We're sorry, something went wrong when we tried to submit this grade. Please try again.",
    };
    hooks.rendererHooks.mockReturnValueOnce(mockHook);

    renderWithIntl(<SubmitErrors />);
    expect(screen.getByText('Grade not submitted')).toBeInTheDocument();
    expect(screen.getByText("We're sorry, something went wrong when we tried to submit this grade. Please try again.")).toBeInTheDocument();
  });

  it('renders action buttons when provided', () => {
    const mockHook = {
      show: true,
      reviewActions: {
        confirm: {
          onClick: jest.fn(),
          message: {
            id: 'ora-grading.ReviewModal.resubmitGrade',
            defaultMessage: 'Resubmit grate',
          },
        },
        cancel: {
          onClick: jest.fn(),
          message: {
            id: 'ora-grading.ReviewModal.dismiss',
            defaultMessage: 'Dismiss',
          },
        },
      },
      headingMessage: {
        id: 'ora-grading.ReviewModal.gradeNotSubmitted.heading',
        defaultMessage: 'Grade not submitted',
      },
      content: "We're sorry, something went wrong when we tried to submit this grade. Please try again.",
    };
    hooks.rendererHooks.mockReturnValueOnce(mockHook);

    renderWithIntl(<SubmitErrors />);
    expect(screen.getByText('Resubmit grate')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });
});
