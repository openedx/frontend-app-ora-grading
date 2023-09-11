import { actions, selectors } from 'data/redux';
import { ErrorStatuses, RequestKeys } from 'data/constants/requests';
import * as thunkActions from './grading';

jest.mock('./requests', () => ({
  fetchSubmission: (args) => ({ fetchSubmission: args }),
  fetchSubmissionStatus: (args) => ({ fetchSubmissionStatus: args }),
  setLock: (args) => ({ setLock: args }),
  submitGrade: (args) => ({ submitGrade: args }),
}));

jest.mock('data/redux/app/selectors', () => ({
  fillGradeData: (state, data) => ({ fillGradeData: state, data }),
}));

jest.mock('data/redux/grading/selectors', () => ({
  prev: {
    doesExist: jest.fn((state) => ({ prevDoesExist: state })),
  },
  next: {
    doesExist: jest.fn((state) => ({ nextDoesExist: state })),
  },
  selected: {
    gradeData: jest.fn((state) => ({ gradeData: state })),
    gradingData: jest.fn((state) => ({ gradingData: state })),
    isGrading: jest.fn((state) => ({ isGrading: state })),
    submissionUUID: jest.fn((state) => ({ selectedSubmissionUUID: state })),
    lockStatus: jest.fn((state) => ({ lockStatus: state })),
  },
  validation: {
    isValidForSubmit: jest.fn((state) => ({ isValidForSubmit: state })),
  },
}));

const testState = { some: 'testy-state' };
const selectedUUID = selectors.grading.selected.submissionUUID(testState);
const response = 'test-response';
const objResponse = { response };
let actionArgs;
const dispatch = jest.fn((action) => ({ dispatch: action }));
const getState = () => testState;

const getDispatched = (calledAction) => {
  calledAction(dispatch, getState);
};

describe('grading thunkActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadSubmission', () => {
    beforeEach(() => {
      getDispatched(thunkActions.loadSubmission());
      actionArgs = dispatch.mock.calls[1][0].fetchSubmission;
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
    });
    test('dispatches fetchSubmission', () => {
      expect(actionArgs).not.toEqual(undefined);
    });
    describe('fetchSubmissionArgs', () => {
      test('submissionUUID: selectors.grading.selected.submissionUUID', () => {
        expect(actionArgs.submissionUUID).toEqual(
          selectedUUID,
        );
      });
      test('onSuccess: dispatches loadSubmission with response and submissionUUID', () => {
        dispatch.mockClear();
        actionArgs.onSuccess(objResponse);
        expect(dispatch).toHaveBeenCalledWith(
          actions.grading.loadSubmission({ ...objResponse, submissionUUID: selectedUUID }),
        );
      });
    });
  });

  describe('loadSubmission inheritors', () => {
    let loadSubmission;
    beforeAll(() => {
      loadSubmission = thunkActions.loadSubmission;
      thunkActions.loadSubmission = args => ({ loadSubmission: args });
    });
    afterAll(() => {
      thunkActions.loadSubmission = loadSubmission;
    });
    describe('loadNext', () => {
      test('dispatches actions.grading.loadNext and then loadSubmission', () => {
        thunkActions.loadNext()(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles })],
          [actions.grading.loadNext()],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
    describe('loadPrev', () => {
      test('clears submitGrade status and dispatches actions.grading.loadPrev and then loadSubmission', () => {
        thunkActions.loadPrev()(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.clearRequest({ requestKey: RequestKeys.downloadFiles })],
          [actions.grading.loadPrev()],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
    describe('loadSelectionForReview', () => {
      const submissionUUIDs = [
        'submission-id-0',
        'submission-id-1',
        'submission-id-2',
        'submission-id-3',
      ];
      test('dispatches actions.grading.updateSelection, actions.app.setShowReview(true), and then loadSubmission', () => {
        thunkActions.loadSelectionForReview(submissionUUIDs)(dispatch, getState);
        expect(dispatch.mock.calls).toEqual([
          [actions.grading.updateSelection(submissionUUIDs)],
          [actions.app.setShowReview(true)],
          [thunkActions.loadSubmission()],
        ]);
      });
    });
  });

  describe('startGrading', () => {
    beforeEach(() => {
      getDispatched(thunkActions.startGrading());
      actionArgs = dispatch.mock.calls[1][0].setLock;
    });
    test('dispatches setLock with selected submissionUUID and value: true', () => {
      expect(actionArgs).not.toEqual(undefined);
      expect(actionArgs.value).toEqual(true);
      expect(actionArgs.submissionUUID).toEqual(selectors.grading.selected.submissionUUID(testState));
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
    });
    describe('onSuccess', () => {
      const gradeData = { some: 'test grade data' };
      const startResponse = { other: 'fields', gradeData };
      const fillString = 'selectors.app.fillGradeData based on selected gradeData';
      beforeEach(() => { dispatch.mockClear(); });
      test(`dispatches startGrading w/ ${fillString}`, () => {
        actionArgs.onSuccess(startResponse);
        expect(dispatch.mock.calls).toContainEqual([
          actions.app.setShowRubric(true),
        ], [
          actions.grading.startGrading({
            ...startResponse,
            gradeData: selectors.app.fillGradeData(
              testState,
              selectors.grading.selected.gradeData(testState),
            ),
          }),
        ]);
        expect(dispatch.mock.calls).toContainEqual([actions.app.setShowRubric(true)]);
      });
    });
    describe('onFailure', () => {
      beforeEach(() => { dispatch.mockClear(); });
      it('dispatches action to fail setting the lock if error status is Forbidden', () => {
        const data = { some: 'data' };
        actionArgs.onFailure({ response: { status: 'arbitrary-status', data } });
        expect(dispatch).not.toHaveBeenCalled();
        actionArgs.onFailure({ response: { status: ErrorStatuses.forbidden, data } });
        expect(dispatch).toHaveBeenCalledWith(actions.grading.failSetLock(data));
      });
    });
  });

  describe('cancelGrading', () => {
    beforeEach(() => {
      getDispatched(thunkActions.cancelGrading());
      actionArgs = dispatch.mock.calls[1][0].setLock;
    });
    test('dispatches clearRequest for submitGrade', () => {
      const requestKey = RequestKeys.submitGrade;
      expect(dispatch.mock.calls[0]).toEqual([actions.requests.clearRequest({ requestKey })]);
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
        expect(dispatch.mock.calls).toContainEqual([actions.grading.stopGrading()]);
      });
    });
    describe('onFailure', () => {
      beforeEach(() => { dispatch.mockClear(); });
      it('dispatches action to fail setting the lock if error status is Forbidden', () => {
        const data = { some: 'data' };
        actionArgs.onFailure({ response: { status: 'arbitrary-status', data } });
        expect(dispatch).not.toHaveBeenCalled();
        actionArgs.onFailure({ response: { status: ErrorStatuses.forbidden, data } });
        expect(dispatch).toHaveBeenCalledWith(actions.grading.failSetLock(data));
      });
    });
  });

  describe('submitGrade', () => {
    const mockGradingData = (args) => ({ gradingData: args });
    const mockSubmissionUUID = (args) => ({ submissionUUID: args });
    beforeEach(() => {
      selectors.grading.selected.gradingData.mockImplementationOnce(mockGradingData);
      selectors.grading.selected.submissionUUID.mockImplementationOnce(mockSubmissionUUID);
    });
    describe('if grade data is valid for submission', () => {
      beforeEach(() => {
        selectors.grading.validation.isValidForSubmit.mockReturnValueOnce(true);
        getDispatched(thunkActions.submitGrade());
      });
      it('hides validation and submits grade', () => {
        expect(dispatch.mock.calls[0][0]).toEqual(actions.grading.setShowValidation(false));
        expect(dispatch.mock.calls[1][0].submitGrade).not.toEqual(undefined);
      });
      describe('submitGrade args', () => {
        let submitGrade;
        beforeEach(() => {
          ([, [{ submitGrade }]] = dispatch.mock.calls);
        });
        it('loads submissionUUID and gradeData from selected submission', () => {
          expect(submitGrade.submissionUUID).toEqual(mockSubmissionUUID(testState));
          expect(submitGrade.gradeData).toEqual(mockGradingData(testState));
        });
        test('on success, dispatches completeGrading action with response', () => {
          dispatch.mockClear();
          submitGrade.onSuccess(response);
          expect(dispatch.mock.calls).toEqual([[actions.grading.completeGrading(response)]]);
        });
        test('on failure, dispatches stopGrading action w/ error if status is Conflict', () => {
          dispatch.mockClear();
          submitGrade.onFailure({ response: { status: 'arbitrary', data: response } });
          expect(dispatch).not.toHaveBeenCalled();
          submitGrade.onFailure({
            response: { status: ErrorStatuses.conflict, data: response },
          });
          expect(dispatch.mock.calls).toEqual([[actions.grading.stopGrading(response)]]);
        });
      });
    });
    describe('if grade data is invalid for submission', () => {
      beforeEach(() => {
        selectors.grading.validation.isValidForSubmit.mockReturnValueOnce(false);
        getDispatched(thunkActions.submitGrade());
      });
      it('sets showValidation to false', () => {
        expect(dispatch.mock.calls).toEqual([[
          actions.grading.setShowValidation(true),
        ]]);
      });
    });
  });
});
