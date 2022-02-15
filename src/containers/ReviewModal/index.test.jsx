import React from 'react';
import { shallow } from 'enzyme';

import { selectors, actions, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import {
  ReviewModal,
  mapStateToProps,
  mapDispatchToProps,
} from '.';

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
      errorStatus: (...args) => ({ errorStatus: args }),
    },
  },
  actions: {
    app: {
      setShowReview: jest.fn(),
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
    },
  },
}));

jest.mock('containers/ReviewActions', () => 'ReviewActions');
jest.mock('./ReviewContent', () => 'ReviewContent');
jest.mock('components/LoadingMessage', () => 'LoadingMessage');

const requestKey = RequestKeys.fetchSubmission;

describe('ReviewModal component', () => {
  let el;
  const props = {
    oraName: 'test-ora-name',
    isOpen: false,
    response: { text: (<div>some text</div>) },
    showRubric: false,
    isLoaded: false,
  };
  beforeEach(() => {
    props.setShowReview = jest.fn();
    props.reloadSubmissions = jest.fn();
  });
  describe('component', () => {
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
        el.setProps({ isOpen: true, errorStatus: 200 });
        expect(render()).toMatchSnapshot();
      });
      test('success', () => {
        el.setProps({ isOpen: true, isLoaded: true });
        expect(render()).toMatchSnapshot();
      });
    });

    describe('component', () => {
      beforeEach(() => {
        el = shallow(<ReviewModal {...props} />);
      });
      test('setShowReview and reloadSubmissions get call on modal close', () => {
        el.instance().onClose();
        const { setShowReview, reloadSubmissions } = props;
        expect(setShowReview).toHaveBeenCalledTimes(1);
        expect(reloadSubmissions).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
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
    test('isLoaded loads from requests.isCompleted(fetchSubmission)', () => {
      expect(mapped.isLoaded).toEqual(selectors.requests.isCompleted(testState, { requestKey }));
    });
    test('errorStatus loads from requests.errorStatus(fetchSubmission)', () => {
      expect(mapped.errorStatus).toEqual(selectors.requests.errorStatus(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads setShowReview from actions.app.setShowReview', () => {
      expect(mapDispatchToProps.setShowReview).toEqual(actions.app.setShowReview);
    });

    it('loads reloadSubmissions from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.reloadSubmissions).toEqual(thunkActions.app.initialize);
    });
  });
});
