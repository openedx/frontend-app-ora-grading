import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux';
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
      isEnabled: (args) => ({ isEnabled: args }),
      ora: { name: (...args) => ({ oraName: args }) },
      showReview: (...args) => ({ showReview: args }),
    },
    grading: {
      hasGradingProgress: (args) => ({ hasGradingProgress: args }),
      selected: {
        response: (...args) => ({ selectedResponse: args }),
      },
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
    grading: {
      cancelGrading: jest.fn(),
    },
  },
}));

jest.mock('components/LoadingMessage', () => 'LoadingMessage');
jest.mock('containers/DemoWarning', () => 'DemoWarning');
jest.mock('containers/ReviewActions', () => 'ReviewActions');
jest.mock('./ReviewContent', () => 'ReviewContent');
jest.mock('./components/CloseReviewConfirmModal', () => 'CloseReviewConfirmModal');

const requestKey = RequestKeys.fetchSubmission;

describe('ReviewModal component', () => {
  let el;
  const props = {
    intl: { formatMessage },
    hasGradingProgress: false,
    errorStatus: null,
    isEnabled: true,
    isLoaded: false,
    isOpen: false,
    oraName: 'test-ora-name',
    response: { text: (<div>some text</div>) },
    showRubric: false,
  };
  beforeEach(() => {
    props.setShowReview = jest.fn();
    props.stopGrading = jest.fn();
    props.reloadSubmissions = jest.fn();
    props.cancelReview = jest.fn();
  });
  describe('component', () => {
    describe('snapshots', () => {
      let render;
      beforeEach(() => {
        el = shallow(<ReviewModal {...props} />);
        el.instance().onClose = jest.fn().mockName('this.onClose');
        el.instance().closeModal = jest.fn().mockName('this.closeModal');
        el.instance().showConfirmCloseReviewGrade = jest.fn().mockName('this.showConfirmCloseReviewGrade');
        el.instance().hideConfirmCloseReviewGrade = jest.fn().mockName('this.hideConfirmCloseReviewGrade');
        el.instance().confirmCloseReviewGrade = jest.fn().mockName('this.confirmCloseReviewGrade');
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
      test('success, demo (title message)', () => {
        const oldEnv = process.env;
        el.setProps({ isOpen: true, isLoaded: true, isEnabled: false });
        expect(render()).toMatchSnapshot();
        process.env = oldEnv;
      });
    });

    describe('component', () => {
      describe('onClose', () => {
        test('no grading progress - close modal', () => {
          el = shallow(<ReviewModal {...props} />);
          el.instance().closeModal = jest.fn();
          el.instance().onClose();
          expect(el.state().showConfirmCloseReviewGrade).toBe(false);
          expect(el.instance().closeModal).toHaveBeenCalled();
        });

        describe('is grading', () => {
          beforeEach(() => {
            el = shallow(<ReviewModal {...props} hasGradingProgress />);
            el.instance().closeModal = jest.fn();
          });

          test('show modal', () => {
            el.instance().onClose();
            expect(el.state().showConfirmCloseReviewGrade).toBe(true);
          });

          test('cancel closing then just close confirm do nothing else', () => {
            el.instance().onClose();
            el.instance().hideConfirmCloseReviewGrade();
            expect(el.state().showConfirmCloseReviewGrade).toBe(false);
            expect(el.instance().closeModal).not.toHaveBeenCalled();
          });

          test('confirm closing then stop grading and close the modal', () => {
            el.instance().onClose();
            el.instance().confirmCloseReviewGrade();
            expect(el.state().showConfirmCloseReviewGrade).toBe(false);
            expect(el.instance().closeModal).toHaveBeenCalled();
          });
        });
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
      expect(mapped.errorStatus).toEqual(selectors.requests.errorStatus(testState, { requestKey }));
    });
    test('hasGradingProgress loads from grading.hasGradingProgress', () => {
      expect(mapped.hasGradingProgress).toEqual(
        selectors.grading.hasGradingProgress(testState),
      );
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
    test('isEnabled loads from app.isEnabled', () => {
      expect(mapped.isEnabled).toEqual(selectors.app.isEnabled(testState));
    });
    test('isLoaded loads from requests.isCompleted(fetchSubmission)', () => {
      expect(mapped.isLoaded).toEqual(selectors.requests.isCompleted(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads cancelReview from thunkActions.app.cancelReview', () => {
      expect(mapDispatchToProps.cancelReview).toEqual(thunkActions.app.cancelReview);
    });
  });
});
