import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { selectors } from 'data/redux';
import { ErrorStatuses, RequestKeys } from 'data/constants/requests';

import {
  LockErrors,
  mapStateToProps,
} from './LockErrors';

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      errorStatus: (...args) => ({ errorStatus: args }),
      isFailed: (...args) => ({ isFailed: args }),
    },
  },
}));

let el;
jest.mock('./ReviewError', () => 'ReviewError');

const requestKey = RequestKeys.setLock;

describe('LockErrors component', () => {
  const props = {
    isFailed: true,
  };
  describe('component', () => {
    beforeEach(() => {
      el = shallow(<LockErrors {...props} />);
      el.instance.dismissError = jest.fn().mockName('this.dismissError');
    });
    describe('snapshots', () => {
      test('no failure', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('snapshot: error with bad request', () => {
        el = shallow(<LockErrors {...props} errorStatus={ErrorStatuses.badRequest} />);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('snapshot: error with conflicted lock', () => {
        el = shallow(<LockErrors {...props} errorStatus={ErrorStatuses.forbidden} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('errorStatus loads from requests.errorStatus(setLock)', () => {
      expect(mapped.errorStatus).toEqual(
        selectors.requests.errorStatus(testState, { requestKey }),
      );
    });
  });
});
