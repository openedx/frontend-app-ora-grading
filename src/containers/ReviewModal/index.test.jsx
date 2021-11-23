import React from 'react';
import { shallow } from 'enzyme';

import { selectors, actions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import {
  ReviewModal,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

let el;
jest.useFakeTimers('modern');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      ora: { name: (...args) => ({ oraName: args }) },
      showReview: (...args) => ({ showReview: args }),
    },
    grading: {
      selected: { response: (...args) => ({ selectedResponse: args }) },
    },
    requests: {
      isCompleted: (...args) => ({ isCompleted: args }),
      isFailed: (...args) => ({ isFailed: args }),
    },
  },
  actions: {
    app: {
      setShowReview: jest.fn(),
    },
  },
}));

jest.mock('containers/ReviewActions', () => 'ReviewActions');
jest.mock('./ReviewError', () => 'ReviewError');
jest.mock('./ReviewContent', () => 'ReviewContent');
jest.mock('components/LoadingMessage', () => 'LoadingMessage');

describe('ReviewModal component', () => {
  const props = {
    oraName: 'test-ora-name',
    isOpen: false,
    response: { text: (<div>some text</div>) },
    showRubric: false,
    isLoaded: false,
    hasError: false,
  };
  describe('component', () => {
    beforeEach(() => {
      props.setShowReview = jest.fn();
    });
    describe('snapshots', () => {
      let render;
      beforeEach(() => {
        el = shallow(<ReviewModal {...props} />);
        el.instance().onClose = jest.fn().mockName('this.onClose');
        render = () => el.instance().render();
      });
      test('closed', () => {
        expect(render()).toMatchSnapshot();
      });
      test('loading', () => {
        el.setProps({ isOpen: true });
        expect(render()).toMatchSnapshot();
      });
      test('error', () => {
        el.setProps({ isOpen: true, hasError: true });
        expect(render()).toMatchSnapshot();
      });
      test('success', () => {
        el.setProps({ isOpen: true, isLoaded: true });
        expect(render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    const requestKey = RequestKeys.fetchSubmission;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('oraName loads from app.ora.name', () => {
      expect(mapped.oraName).toEqual(selectors.app.ora.name(testState));
    });
    test('isOpen loads from app.showReview', () => {
      expect(mapped.isOpen).toEqual(selectors.app.showReview(testState));
    });
    test('response loads from grading.selected.response', () => {
      expect(mapped.response).toEqual(selectors.grading.selected.response(testState));
    });
    test('isLoaded loads from requests.isCompleted', () => {
      expect(mapped.isLoaded).toEqual(selectors.requests.isCompleted(testState, { requestKey }));
    });
    test('hasError loads from requests.isFailed', () => {
      expect(mapped.hasError).toEqual(selectors.requests.isFailed(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads setShowReview from thunkActions.app.setShowReview', () => {
      expect(mapDispatchToProps.setShowReview).toEqual(actions.app.setShowReview);
    });
  });
});
