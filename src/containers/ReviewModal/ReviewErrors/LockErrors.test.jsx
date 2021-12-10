import React from 'react';
import { shallow } from 'enzyme';

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
      el.instance().dismissError = jest.fn().mockName('this.dismissError');
    });
    describe('snapshots', () => {
      test('no failure', () => {
        el.setProps({ isFailed: false });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: error with bad request', () => {
        el.setProps({ errorStatus: ErrorStatuses.badRequest });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: error with conflicted lock', () => {
        el.setProps({ errorStatus: ErrorStatuses.forbidden });
        expect(el.instance().render()).toMatchSnapshot();
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
