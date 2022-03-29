import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { selectors, actions, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

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
      selected: {
        response: (...args) => ({ selectedResponse: args }),
        gradingStatus: (...args) => ({ selectedGradeStatus: args }),
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

jest.mock('containers/ReviewActions', () => 'ReviewActions');
jest.mock('./ReviewContent', () => 'ReviewContent');
jest.mock('components/LoadingMessage', () => 'LoadingMessage');
jest.mock('./components/CloseReviewConfirmModal', () => 'CloseReviewConfirmModal');

const requestKey = RequestKeys.fetchSubmission;

describe('ReviewModal component', () => {
  let el;
  const props = {
    oraName: 'test-ora-name',
    isOpen: false,
    response: { text: (<div>some text</div>) },
    showRubric: false,
    isLoaded: false,
    errorStatus: null,
    gradingStatus: statuses.ungraded,
    intl: { formatMessage },
  };
  beforeEach(() => {
    props.setShowReview = jest.fn();
    props.stopGrading = jest.fn();
    props.reloadSubmissions = jest.fn();
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
        process.env.REACT_APP_NOT_ENABLED = true;
        el.setProps({ isOpen: true, isLoaded: true });
        expect(render()).toMatchSnapshot();
        process.env = oldEnv;
      });
    });

    describe('component', () => {
      describe('close modal', () => {
        test('is not grading', () => {
          el = shallow(<ReviewModal {...props} />);
          el.instance().onClose();
          expect(el.state('showConfirmCloseReviewGrade')).toBe(false);

          const { setShowReview, reloadSubmissions, stopGrading } = props;
          expect(stopGrading).not.toHaveBeenCalled();
          expect(setShowReview).toHaveBeenCalled();
          expect(reloadSubmissions).toHaveBeenCalled();
        });

        describe('is grading', () => {
          beforeEach(() => {
            el = shallow(<ReviewModal {...props} gradingStatus={statuses.inProgress} />);
          });

          test('show modal', () => {
            el.instance().onClose();
            expect(el.state('showConfirmCloseReviewGrade')).toBe(true);
          });

          test('cancel closing then just close confirm do nothing else', () => {
            el.instance().onClose();
            el.instance().hideConfirmCloseReviewGrade();
            expect(el.state('showConfirmCloseReviewGrade')).toBe(false);

            const { setShowReview, reloadSubmissions, stopGrading } = props;
            expect(stopGrading).not.toHaveBeenCalled();
            expect(setShowReview).not.toHaveBeenCalled();
            expect(reloadSubmissions).not.toHaveBeenCalled();
          });

          test('confirm closing then stop grading and close the modal', () => {
            el.instance().onClose();
            el.instance().confirmCloseReviewGrade();
            expect(el.state('showConfirmCloseReviewGrade')).toBe(false);

            const { setShowReview, reloadSubmissions, stopGrading } = props;
            expect(stopGrading).toHaveBeenCalled();
            expect(setShowReview).toHaveBeenCalled();
            expect(reloadSubmissions).toHaveBeenCalled();
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

    test('gradingStatus loads from grading.selected.gradingStatus', () => {
      expect(mapped.gradingStatus).toEqual(selectors.grading.selected.gradingStatus(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads setShowReview from actions.app.setShowReview', () => {
      expect(mapDispatchToProps.setShowReview).toEqual(actions.app.setShowReview);
    });

    it('loads reloadSubmissions from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.reloadSubmissions).toEqual(thunkActions.app.initialize);
    });

    it('loads stopGrading from thunkActions.grading.cancelGrading', () => {
      expect(mapDispatchToProps.stopGrading).toEqual(thunkActions.grading.cancelGrading);
    });
  });
});
