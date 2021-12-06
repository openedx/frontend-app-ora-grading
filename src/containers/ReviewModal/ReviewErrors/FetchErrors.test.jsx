import React from 'react';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import {
  FetchErrors,
  mapStateToProps,
  mapDispatchToProps,
} from './FetchErrors';

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      isFailed: (...args) => ({ isFailed: args }),
    },
  },
  thunkActions: {
    grading: {
      loadSubmission: jest.fn(),
    },
  },
}));

jest.mock('./ReviewError', () => 'ReviewError');

const requestKey = RequestKeys.fetchSubmission;

describe('FetchErrors component', () => {
  const props = {
    isFailed: false,
  };
  describe('component', () => {
    beforeEach(() => {
      props.reload = jest.fn();
    });
    describe('snapshots', () => {
      test('snapshot: no failure', () => {
        expect(<FetchErrors {...props} />).toMatchSnapshot();
      });
      test('snapshot: with failure', () => {
        expect(<FetchErrors {...props} isFailed={false} />).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('isFailed loads from requests.isFailed(fetchSubmission)', () => {
      expect(mapped.isFailed).toEqual(selectors.requests.isFailed(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads reload from thunkActions.grading.loadSubmission', () => {
      expect(mapDispatchToProps.reload).toEqual(thunkActions.grading.loadSubmission);
    });
  });
});
