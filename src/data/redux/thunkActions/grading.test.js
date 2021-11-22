import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses } from 'data/services/lms/constants';

import { actions, selectors } from 'data/redux';
import * as thunkActions from './grading';

jest.mock('./requests', () => ({
  fetchSubmission: (args) => ({ fetchSubmission: args }),
  fetchSubmissionResponse: (args) => ({ fetchSubmissionResponse: args }),
  fetchSubmissionStatus: (args) => ({ fetchSubmissionStatus: args }),
  setLock: (args) => ({ setLock: args }),
  submitGrade: (args) => ({ submitGrade: args }),
}));

jest.mock('data/redux/app/selectors', () => ({
  emptyGrade: (state) => ({ emptyGrade: state }),
}));

jest.mock('data/redux/grading/selectors', () => ({
  prev: {
    submissionUUID: (state) => ({ prevsubmissionUUID: state }),
    doesExist: jest.fn((state) => ({ prevDoesExist: state })),
  },
  next: {
    submissionUUID: (state) => ({ prevsubmissionUUID: state }),
    doesExist: jest.fn((state) => ({ nextDoesExist: state })),
  },
  selected: {
    submissionUUID: (state) => ({ selectedsubmissionUUID: state }),
    gradeData: jest.fn((state) => ({ gradeData: state })),
  },
}));

describe('grading thunkActions', () => {
  const testState = { some: 'testy-state' };
  const submissionUUID = 'test-submission-id';
  const response = 'test-response';
  let dispatch;
  let dispatched;
  let actionArgs;
  const getState = () => testState;

  const getDispatched = (calledAction) => {
    calledAction(dispatch, getState);
    [[dispatched]] = dispatch.mock.calls;
  };

  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });

  describe('prefetchNext', () => {
    beforeEach(() => {
      getDispatched(thunkActions.prefetchNext());
      actionArgs = dispatched.fetchSubmissionResponse;
    });
    it('dispatches fetchSubmissionResponse with prefetchNext key and nextsubmissionUUID', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.requestKey).toEqual(RequestKeys.prefetchNext);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.prev.submissionUUID(testState));
    });
    describe('on success', () => {
      test('dispatches preloadNext', () => {
        dispatch.mockClear();
        actionArgs.onSuccess(response);
        expect(dispatch.mock.calls).toEqual([
          [actions.grading.preloadNext(response)],
        ]);
      });
    });
  });

  describe('prefetchPrev', () => {
    beforeEach(() => {
      getDispatched(thunkActions.prefetchPrev());
      actionArgs = dispatched.fetchSubmissionResponse;
    });
    it('dispatches fetchSubmissionResponse with prefetchPrev key and next submissionUUID', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.requestKey).toEqual(RequestKeys.prefetchPrev);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.next.submissionUUID(testState));
    });
    describe('on success', () => {
      test('dispatches preloadPrev', () => {
        dispatch.mockClear();
        actionArgs.onSuccess(response);
        expect(dispatch.mock.calls).toEqual([
          [actions.grading.preloadPrev(response)],
        ]);
      });
    });
  });

  describe('fetchNeighbor', () => {
    const loadAction = actions.grading.loadNext;
    const prefetchAction = actions.grading.loadNext;

    const submitAction = (hasNeighbor) => {
      getDispatched(thunkActions.fetchNeighbor({
        submissionUUID,
        loadAction,
        hasNeighbor,
        prefetchAction,
      }));
      actionArgs = dispatched.fetchSubmissionStatus;
    };

    it('calls fetchSubmissionStatus with submissionUUID', () => {
      submitAction(false);
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.submissionUUID).toEqual(submissionUUID);
    });
    describe('onSuccess', () => {
      it('dispatches startGrading if lockStatus is in progress', () => {
        submitAction(false);
        dispatch.mockClear();
        actionArgs.onSuccess({ lockStatus: gradingStatuses.inProgress });
      });
      it('dispatches stopGrading if lockStatus is not in progress', () => {
        submitAction(false);
        dispatch.mockClear();
        actionArgs.onSuccess({ lockStatus: 'other status' });
      });
    });
  });

  describe('fetchNeigbor inheritors', () => {
    let fetchNeighbor;
    beforeAll(() => {
      fetchNeighbor = thunkActions.fetchNeighbor;
      thunkActions.fetchNeighbor = args => ({ fetchNeighbor: args });
    });
    afterAll(() => {
      thunkActions.fetchNeighbor = fetchNeighbor;
    });
    describe('loadNext', () => {
      beforeEach(() => {
        getDispatched(thunkActions.loadNext());
        actionArgs = dispatched.fetchNeighbor;
      });
      test('dispatches fetchNeighbor', () => {
        expect(actionArgs).not.toEqual(undefined);
      });
      describe('fetchNeighbor args', () => {
        const selGroup = selectors.grading.next;
        test('loadAction: actions.grading.loadNext', () => {
          expect(actionArgs.loadAction).toEqual(actions.grading.loadNext);
        });
        test('prefetchAction: module.prefetchNext', () => {
          expect(actionArgs.prefetchAction).toEqual(thunkActions.prefetchNext);
        });
        test('hasNeighbor: selectors.grading.next.doesExist', () => {
          expect(actionArgs.hasNeighbor).toEqual(selGroup.doesExist(testState));
        });
        test('submissionUUID: selectors.grading.next.submissionUUID', () => {
          expect(actionArgs.submissionUUID).toEqual(selGroup.submissionUUID(testState));
        });
      });
    });
    describe('loadPrev', () => {
      beforeEach(() => {
        getDispatched(thunkActions.loadPrev());
        actionArgs = dispatched.fetchNeighbor;
      });
      test('dispatches fetchNeighbor', () => {
        expect(actionArgs).not.toEqual(undefined);
      });
      describe('fetchNeighbor args', () => {
        const selGroup = selectors.grading.prev;
        test('loadAction: actions.grading.loadPrev', () => {
          expect(actionArgs.loadAction).toEqual(actions.grading.loadPrev);
        });
        test('prefetchAction: module.prefetchPrev', () => {
          expect(actionArgs.prefetchAction).toEqual(thunkActions.prefetchPrev);
        });
        test('hasNeighbor: selectors.grading.prev.doesExist', () => {
          expect(actionArgs.hasNeighbor).toEqual(selGroup.doesExist(testState));
        });
        test('submissionUUID: selectors.grading.prev.submissionUUID', () => {
          expect(actionArgs.submissionUUID).toEqual(selGroup.submissionUUID(testState));
        });
      });
    });
  });

  describe('loadSelectionForReview', () => {
    const submissionUUIDs = [
      'submission-id-0',
      'submission-id-1',
      'submission-id-2',
      'submission-id-3',
    ];
    let prefetchPrev;
    let prefetchNext;
    beforeAll(() => {
      prefetchNext = thunkActions.prefetchNext;
      prefetchPrev = thunkActions.prefetchPrev;
      thunkActions.prefetchNext = () => 'prefetch next';
      thunkActions.prefetchPrev = () => 'prefetch prev';
    });
    afterAll(() => {
      thunkActions.prefetchNext = prefetchNext;
      thunkActions.prefetchPrev = prefetchPrev;
    });
    beforeEach(() => {
      getDispatched(thunkActions.loadSelectionForReview(submissionUUIDs));
      actionArgs = dispatched.fetchSubmission;
    });
    it('dispatches fetchSubmission with first submissionUUID', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.submissionUUID).toEqual(submissionUUIDs[0]);
    });
    describe('onSuccess', () => {
      beforeEach(() => {
        dispatch.mockClear();
        actionArgs.onSuccess(response);
      });
      it('dispatches updateSelection with passed submissionUUIDs', () => {
        expect(dispatch.mock.calls).toContainEqual(
          [actions.grading.updateSelection(submissionUUIDs)],
        );
      });
      it('dispatches actions.grading.loadSubmission with response and first submission id', () => {
        expect(dispatch.mock.calls).toContainEqual(
          [actions.grading.loadSubmission({ ...response, submissionUUID: submissionUUIDs[0] })],
        );
      });
      it('dispatches app setShowReview(true)', () => {
        expect(dispatch.mock.calls).toContainEqual(
          [actions.app.setShowReview(true)],
        );
      });
      it('dispatches prefetchNext iff selectors.grading.next.doesExist', () => {
        // default configured to be truthy
        expect(dispatch.mock.calls).toContainEqual(
          [thunkActions.prefetchNext()],
        );
        selectors.grading.next.doesExist.mockReturnValue(false);
        dispatch.mockClear();
        actionArgs.onSuccess(response);
        expect(dispatch.mock.calls).not.toContainEqual(
          [thunkActions.prefetchNext()],
        );
      });
      it('dispatches prefetchPrev iff selectors.grading.prev.doesExist', () => {
        // default configured to be truthy
        expect(dispatch.mock.calls).toContainEqual(
          [thunkActions.prefetchPrev()],
        );
        selectors.grading.prev.doesExist.mockReturnValue(false);
        dispatch.mockClear();
        actionArgs.onSuccess(response);
        expect(dispatch.mock.calls).not.toContainEqual(
          [thunkActions.prefetchPrev()],
        );
      });
    });
  });

  describe('startGrading', () => {
    beforeEach(() => {
      getDispatched(thunkActions.startGrading());
      actionArgs = dispatched.setLock;
    });
    test('dispatches setLock with selected submissionUUID and value: true', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(true);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.selected.submissionUUID(testState));
    });
    describe('onSuccess', () => {
      const gradeData = { some: 'test grade data' };
      const startResponse = { other: 'fields', gradeData };
      beforeEach(() => {
        dispatch.mockClear();
      });
      test('dispatches startGrading with selected gradeData if truthy', () => {
        actionArgs.onSuccess(startResponse);
        expect(dispatch.mock.calls).toContainEqual([actions.grading.startGrading(startResponse)]);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
      });
      test('dispatches startGrading with empty grade if selected gradeData is not truthy', () => {
        const emptyGrade = selectors.app.emptyGrade(testState);
        const expected = [
          actions.grading.startGrading({ ...startResponse, gradeData: emptyGrade }),
        ];
        actionArgs.onSuccess({ ...startResponse, gradeData: undefined });
        expect(dispatch.mock.calls).toContainEqual(expected);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
        dispatch.mockClear();
        actionArgs.onSuccess({ ...startResponse, gradeData: null });
        expect(dispatch.mock.calls).toContainEqual(expected);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
      });
    });
  });

  describe('cancelGrading', () => {
    let stopGrading;
    beforeAll(() => {
      stopGrading = thunkActions.stopGrading;
      thunkActions.stopGrading = () => 'stop grading';
    });
    beforeEach(() => {
      getDispatched(thunkActions.cancelGrading());
      actionArgs = dispatched.setLock;
    });
    afterAll(() => {
      thunkActions.stopGrading = stopGrading;
    });
    test('dispatches setLock with selected submissionUUID and value: false', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(false);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.selected.submissionUUID(testState));
    });
    describe('onSuccess', () => {
      beforeEach(() => {
        dispatch.mockClear();
      });
      test('dispatches stopGrading thunkAction', () => {
        actionArgs.onSuccess();
        expect(dispatch.mock.calls).toContainEqual([thunkActions.stopGrading()]);
      });
    });
  });

  describe('stopGrading', () => {
    it('dispatches grading.stopGrading', () => {
      thunkActions.stopGrading()(dispatch, getState);
      expect(dispatch.mock.calls).toEqual([
        [actions.grading.stopGrading()],
      ]);
    });
  });
});
