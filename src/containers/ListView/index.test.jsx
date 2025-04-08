import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { selectors, thunkActions } from '@src/data/redux';
import { RequestKeys } from '@src/data/constants/requests';

import { formatMessage } from '@src/testUtils';
import { ListView, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('components/StatusBadge', () => 'StatusBadge');
jest.mock('containers/ReviewModal', () => 'ReviewModal');
jest.mock('./ListViewBreadcrumb', () => 'ListViewBreadcrumb');
jest.mock('./ListError', () => 'ListError');
jest.mock('./SubmissionsTable', () => 'SubmissionsTable');
jest.mock('./EmptySubmission', () => 'EmptySubmission');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: (...args) => ({ courseId: args }),
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      isFailed: (...args) => ({ isFailed: args }),
    },
    submissions: {
      isEmptySubmissionData: (...args) => ({ isEmptySubmissionData: args }),
    },
  },
  thunkActions: {
    app: {
      initialize: (...args) => ({ initialize: args }),
    },
  },
}));

jest.mock('@openedx/paragon', () => ({
  Container: 'Container',
  Spinner: 'Spinner',
}));

let el;
jest.useFakeTimers('modern');

describe('ListView component', () => {
  describe('component', () => {
    const props = {
      courseId: 'test-course-id',
      isLoaded: false,
      hasError: false,
      isEmptySubmissionData: false,
    };
    beforeEach(() => {
      props.initializeApp = jest.fn();
      props.intl = { formatMessage };
    });
    describe('snapshots', () => {
      beforeEach(() => {
        el = shallow(<ListView {...props} />);
      });
      test('loading', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('loaded has data', () => {
        el = shallow(<ListView {...props} isLoaded />);
        expect(el.snapshot).toMatchSnapshot();
      });

      test('loaded with no data', () => {
        el = shallow(<ListView {...props} isLoaded isEmptySubmissionData />);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('error', () => {
        el = shallow(<ListView {...props} hasError />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
    describe('behavior', () => {
      it('calls initializeApp on load', () => {
        el = shallow(<ListView {...props} />);
        expect(props.initializeApp).toHaveBeenCalled();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    const requestKey = RequestKeys.initialize;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('courseId loads from app.courseId', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
    test('isLoaded loads from requests.isCompleted', () => {
      expect(mapped.isLoaded).toEqual(
        selectors.requests.isCompleted(testState, { requestKey }),
      );
    });
    test('hasError loads from requests.isFailed', () => {
      expect(mapped.hasError).toEqual(
        selectors.requests.isFailed(testState, { requestKey }),
      );
    });
    test('isEmptySubmissionData loads from submissions.isEmptySubmissionData', () => {
      expect(mapped.isEmptySubmissionData).toEqual(
        selectors.submissions.isEmptySubmissionData(testState),
      );
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads initializeApp from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(
        thunkActions.app.initialize,
      );
    });
  });
});
