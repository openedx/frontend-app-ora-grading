import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import {
  ReviewProblemStepsContent,
  mapStateToProps,
} from './ReviewProblemStepsContent';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      showRubric: (...args) => ({ showRubric: args }),
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      isFailed: (...args) => ({ isFailed: args }),
    },
  },
}));
jest.mock('containers/ResponseDisplay', () => 'ResponseDisplay');
jest.mock('containers/Rubric', () => 'Rubric');
jest.mock('containers/ReviewModal/ReviewErrors', () => 'ReviewErrors');

describe('ReviewContent component', () => {
  describe('component', () => {
    describe('render tests', () => {
      test('snapshot: not loaded, no error', () => {
        expect(shallow(<ReviewProblemStepsContent />).isEmptyRender()).toEqual(true);
      });
      test('snapshot: show rubric', () => {
        expect(shallow(<ReviewProblemStepsContent isLoaded />)).toMatchSnapshot();
      });
      test('snapshot: hide rubric', () => {
        expect(shallow(<ReviewProblemStepsContent isLoaded showRubric />)).toMatchSnapshot();
      });
      test('snapshot: failed, showRubric (errors only)', () => {
        expect(shallow(<ReviewProblemStepsContent showRubric isFailed />)).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    const requestKey = RequestKeys.fetchSubmission;
    test('showRubric loads from app.showRubric', () => {
      expect(mapped.showRubric).toEqual(selectors.app.showRubric(testState));
    });
    test('isFailed loads from requests.isFailed(fetchSubmission)', () => {
      expect(mapped.isFailed).toEqual(selectors.requests.isFailed(testState, { requestKey }));
    });
    test('isLoadeed loads from requests.isCompleted(fetchSubmission)', () => {
      expect(mapped.isLoaded).toEqual(selectors.requests.isCompleted(testState, { requestKey }));
    });
  });
});
