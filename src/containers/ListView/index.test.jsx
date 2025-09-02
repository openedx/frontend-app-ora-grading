import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import { formatMessage } from 'testUtils';
import { ListView, mapStateToProps, mapDispatchToProps } from '.';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('containers/ReviewModal', () => {
  const ReviewModal = () => <div data-testid="review-modal">ReviewModal</div>;
  return ReviewModal;
});

jest.mock('./ListViewBreadcrumb', () => {
  const ListViewBreadcrumb = () => (
    <div data-testid="breadcrumb">Back to all open responses</div>
  );
  return ListViewBreadcrumb;
});

jest.mock('./ListError', () => {
  const ListError = () => (
    <div data-testid="list-error">
      <button type="button">Reload submissions</button>
    </div>
  );
  return ListError;
});

jest.mock('./SubmissionsTable', () => {
  const SubmissionsTable = () => (
    <div data-testid="submissions-table">SubmissionsTable</div>
  );
  return SubmissionsTable;
});

jest.mock('./EmptySubmission', () => {
  const EmptySubmission = () => (
    <div data-testid="empty-submission">
      <h3>Nothing here yet</h3>
      <p>When learners submit responses, they will appear here</p>
    </div>
  );
  return EmptySubmission;
});

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: (...args) => ({ courseId: args }),
      isEnabled: () => false,
      oraName: () => 'Test ORA Name',
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      isFailed: (...args) => ({ isFailed: args }),
      allowNavigation: () => true,
    },
    submissions: {
      isEmptySubmissionData: (...args) => ({ isEmptySubmissionData: args }),
    },
    grading: {
      activeIndex: () => 0,
      selectionLength: () => 1,
      selected: {
        submissionUUID: () => null,
        overallFeedback: () => '',
        criteria: () => [],
      },
      next: {
        doesExist: () => false,
      },
      prev: {
        doesExist: () => false,
      },
    },
  },
  thunkActions: {
    app: {
      initialize: (...args) => ({ initialize: args }),
    },
    grading: {
      submitGrade: () => jest.fn(),
    },
  },
}));

describe('ListView component', () => {
  describe('component', () => {
    const props = {
      courseId: 'test-course-id',
      isLoaded: false,
      hasError: false,
      isEmptySubmissionData: false,
      initializeApp: jest.fn(),
      intl: { formatMessage },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('displays loading spinner and message when not loaded and no error', () => {
      render(<IntlProvider locale="en" messages={{}}><ListView {...props} /></IntlProvider>);

      // Check for loading message
      expect(screen.getByText(messages.loadingResponses.defaultMessage)).toBeInTheDocument();

      // Check for spinner by finding element with spinner class
      const spinner = document.querySelector('.pgn__spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('displays ListViewBreadcrumb and SubmissionsTable when loaded with data', () => {
      render(<IntlProvider locale="en" messages={{}}><ListView {...props} isLoaded /></IntlProvider>);

      expect(
        screen.getByText('Back to all open responses'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('submissions-table')).toBeInTheDocument();
      expect(screen.queryByText('FormattedMessage')).not.toBeInTheDocument();
    });

    it('displays EmptySubmission component when loaded but has no submission data', () => {
      render(<IntlProvider locale="en" messages={{}}><ListView {...props} isLoaded isEmptySubmissionData /></IntlProvider>);

      expect(
        screen.getByRole('heading', { name: 'Nothing here yet' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          'When learners submit responses, they will appear here',
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Back to all open responses'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('submissions-table')).not.toBeInTheDocument();
    });

    it('displays ListError component when there is an error', () => {
      render(<IntlProvider locale="en" messages={{}}><ListView {...props} hasError /></IntlProvider>);

      expect(
        screen.getByRole('button', { name: 'Reload submissions' }),
      ).toBeInTheDocument();
      expect(screen.queryByText('FormattedMessage')).not.toBeInTheDocument();
    });

    it('always displays ReviewModal component regardless of state', () => {
      const { rerender } = render(<IntlProvider locale="en" messages={{}}><ListView {...props} /></IntlProvider>);
      expect(screen.getByText('ReviewModal')).toBeInTheDocument();

      rerender(<IntlProvider locale="en" messages={{}}><ListView {...props} isLoaded /></IntlProvider>);
      expect(screen.getByText('ReviewModal')).toBeInTheDocument();

      rerender(<IntlProvider locale="en" messages={{}}><ListView {...props} hasError /></IntlProvider>);
      expect(screen.getByText('ReviewModal')).toBeInTheDocument();
    });

    it('calls initializeApp on component mount', () => {
      render(<IntlProvider locale="en" messages={{}}><ListView {...props} /></IntlProvider>);
      expect(props.initializeApp).toHaveBeenCalledTimes(1);
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    const requestKey = RequestKeys.initialize;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    it('maps courseId from app.courseId selector', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
    it('maps isLoaded from requests.isCompleted selector', () => {
      expect(mapped.isLoaded).toEqual(
        selectors.requests.isCompleted(testState, { requestKey }),
      );
    });
    it('maps hasError from requests.isFailed selector', () => {
      expect(mapped.hasError).toEqual(
        selectors.requests.isFailed(testState, { requestKey }),
      );
    });
    it('maps isEmptySubmissionData from submissions.isEmptySubmissionData selector', () => {
      expect(mapped.isEmptySubmissionData).toEqual(
        selectors.submissions.isEmptySubmissionData(testState),
      );
    });
  });
  describe('mapDispatchToProps', () => {
    it('maps initializeApp to thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(
        thunkActions.app.initialize,
      );
    });
  });
});
