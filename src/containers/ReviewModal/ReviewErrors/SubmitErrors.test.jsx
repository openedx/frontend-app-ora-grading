import React from 'react';
import { shallow } from 'enzyme';

import { actions, selectors, thunkActions } from 'data/redux';
import { ErrorStatuses, RequestKeys } from 'data/constants/requests';

import {
  SubmitErrors,
  mapStateToProps,
  mapDispatchToProps,
} from './SubmitErrors';

jest.mock('data/redux', () => ({
  actions: {
    requests: {
      clearRequest: jest.fn().mockName('actions.requests.clearRequest'),
    },
  },
  selectors: {
    requests: {
      errorStatus: (...args) => ({ errorStatus: args }),
    },
  },
  thunkActions: {
    grading: {
      submitGrade: jest.fn().mockName('thunkActions.grading.submitGrade'),
    },
  },
}));

let el;
jest.mock('./ReviewError', () => 'ReviewError');

const requestKey = RequestKeys.submitGrade;

describe('SubmitErrors component', () => {
  const props = {};
  describe('component', () => {
    beforeEach(() => {
      props.resubmit = jest.fn();
      props.clearRequest = jest.fn();
      el = shallow(<SubmitErrors {...props} />);
      el.instance().dismissError = jest.fn().mockName('this.dismissError');
    });
    describe('snapshots', () => {
      test('snapshot: no failure', () => {
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: with network failure', () => {
        el.setProps({ errorStatus: ErrorStatuses.badRequest });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: with conflict failure', () => {
        el.setProps({ errorStatus: ErrorStatuses.conflict });
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
    test('errorStatus loads from requests.errorStatus(fetchSubmission)', () => {
      expect(mapped.errorStatus).toEqual(
        selectors.requests.errorStatus(testState, { requestKey }),
      );
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads clearRequest from actions.requests.clearRequest', () => {
      expect(mapDispatchToProps.clearRequest).toEqual(actions.requests.clearRequest);
    });
    it('loads resubmit from thunkActions.grading.submitGrade', () => {
      expect(mapDispatchToProps.resubmit).toEqual(thunkActions.grading.submitGrade);
    });
  });
});
