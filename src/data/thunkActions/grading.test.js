import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses } from 'data/services/lms/constants';
import actions from 'data/actions';
import selectors from 'data/selectors';
import * as thunkActions from './grading';

jest.mock('./requests', () => ({
  fetchSubmission: (args) => ({ fetchSubmission: args }),
  fetchSubmissionResponse: (args) => ({ fetchSubmissionResponse: args }),
  fetchSubmissionStatus: (args) => ({ fetchSubmissionStatus: args }),
  setLock: (args) => ({ setLock: args }),
  submitGrade: (args) => ({ submitGrade: args }),
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      emptyGrade: (state) => ({ emptyGrade: state }),
    },
    grading: {
      prev: {
        submissionId: (state) => ({ prevSubmissionId: state }),
        doesExist: jest.fn((state) => ({ prevDoesExist: state })),
      },
      next: {
        submissionId: (state) => ({ prevSubmissionId: state }),
        doesExist: jest.fn((state) => ({ nextDoesExist: state })),
      },
      selected: {
        submissionId: (state) => ({ selectedSubmissionId: state }),
        gradeData: jest.fn((state) => ({ gradeData: state })),
      },
    },
  },
}));

describe('grading thunkActions', () => {
  const testState = { some: 'testy-state' };
  const submissionId = 'test-submission-id';
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
    it('dispatches fetchSubmissionResponse with prefetchNext key and nextSubmissionId', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.requestKey).toEqual(RequestKeys.prefetchNext);
      expect(actionArgs.submissionId).toEqual(selectors.grading.prev.submissionId(testState));
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
    it('dispatches fetchSubmissionResponse with prefetchPrev key and next submissionId', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.requestKey).toEqual(RequestKeys.prefetchPrev);
      expect(actionArgs.submissionId).toEqual(selectors.grading.next.submissionId(testState));
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
    let startGrading;
    let stopGrading;
    const loadAction = actions.grading.loadNext;
    const prefetchAction = actions.grading.loadNext;

    const submitAction = (hasNeighbor) => {
      getDispatched(thunkActions.fetchNeighbor({
        submissionId,
        loadAction,
        hasNeighbor,
        prefetchAction,
      }));
      actionArgs = dispatched.fetchSubmissionStatus;
    };

    beforeAll(() => {
      startGrading = thunkActions.startGrading;
      thunkActions.startGrading = () => 'startGrading';
      stopGrading = thunkActions.stopGrading;
      thunkActions.stopGrading = () => 'stopGrading';
    });
    afterAll(() => {
      thunkActions.startGrading = startGrading;
      thunkActions.stopGrading = stopGrading;
    });

    it('calls fetchSubmissionStatus with submissionId', () => {
      submitAction(false);
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.submissionId).toEqual(submissionId);
    });
    describe('onSuccess', () => {
      it('dispatches startGrading if lockStatus is in progress', () => {
        submitAction(false);
        dispatch.mockClear();
        actionArgs.onSuccess({ lockStatus: gradingStatuses.inProgress });
        expect(dispatch.mock.calls[0]).toEqual([thunkActions.startGrading()]);
      });
      it('dispatches stopGrading if lockStatus is not in progress', () => {
        submitAction(false);
        dispatch.mockClear();
        actionArgs.onSuccess({ lockStatus: 'other status' });
        expect(dispatch.mock.calls[0]).toEqual([thunkActions.stopGrading()]);
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
        test('submissionId: selectors.grading.next.submissionId', () => {
          expect(actionArgs.submissionId).toEqual(selGroup.submissionId(testState));
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
        test('submissionId: selectors.grading.prev.submissionId', () => {
          expect(actionArgs.submissionId).toEqual(selGroup.submissionId(testState));
        });
      });
    });
  });

  describe('loadSelectionForReview', () => {
    const submissionIds = [
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
      getDispatched(thunkActions.loadSelectionForReview(submissionIds));
      actionArgs = dispatched.fetchSubmission;
    });
    it('dispatches fetchSubmission with first submissionId', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.submissionId).toEqual(submissionIds[0]);
    });
    describe('onSuccess', () => {
      beforeEach(() => {
        dispatch.mockClear();
        actionArgs.onSuccess(response);
      });
      it('dispatches updateSelection with passed submissionIds', () => {
        expect(dispatch.mock.calls).toContainEqual(
          [actions.grading.updateSelection(submissionIds)],
        );
      });
      it('dispatches actions.grading.loadSubmission with response and first submission id', () => {
        expect(dispatch.mock.calls).toContainEqual(
          [actions.grading.loadSubmission({ ...response, submissionId: submissionIds[0] })],
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
    test('dispatches setLock with selected submissionId and value: true', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(true);
      expect(actionArgs.submissionId).toEqual(selectors.grading.selected.submissionId(testState));
    });
    describe('onSuccess', () => {
      beforeEach(() => {
        dispatch.mockClear();
      });
      test('dispatches app.setGrading(true)', () => {
        actionArgs.onSuccess();
        expect(dispatch.mock.calls).toContainEqual([actions.app.setGrading(true)]);
      });
      test('dispatches startGrading with selected gradeData if truthy', () => {
        actionArgs.onSuccess();
        const gradeData = selectors.grading.selected.gradeData(testState);
        expect(dispatch.mock.calls).toContainEqual([actions.grading.startGrading(gradeData)]);
      });
      test('dispatches startGrading with empty grade if selected gradeData is not truthy', () => {
        const emptyGrade = selectors.app.emptyGrade(testState);
        selectors.grading.selected.gradeData.mockReturnValueOnce(null);
        actionArgs.onSuccess();
        expect(dispatch.mock.calls).toContainEqual([actions.grading.startGrading(emptyGrade)]);

        dispatch.mockClear();
        selectors.grading.selected.gradeData.mockReturnValueOnce(undefined);
        actionArgs.onSuccess();
        expect(dispatch.mock.calls).toContainEqual([actions.grading.startGrading(emptyGrade)]);
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
    test('dispatches setLock with selected submissionId and value: false', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(false);
      expect(actionArgs.submissionId).toEqual(selectors.grading.selected.submissionId(testState));
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
    it('dispatches grading.clearGrade and app.setGrading(false)', () => {
      thunkActions.stopGrading()(dispatch, getState);
      expect(dispatch.mock.calls).toEqual([
        [actions.grading.clearGrade()],
        [actions.app.setGrading(false)],
      ]);
    });
  });
});
