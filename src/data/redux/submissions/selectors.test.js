import { lockStatuses } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

// Test state for submissions
const testState = {
  submissions: {
    allSubmissions: {
      some: 'Test data',
    },
  },
};

describe('submission selectors unit tests', () => {
  const { simpleSelectors, listData, isEmptySubmissionData } = selectors;
  describe('allSubmissions', () => {
    it('returns allSubmissions entry from submissions data', () => {
      expect(simpleSelectors.allSubmissions(testState)).toEqual(
        testState.submissions.allSubmissions,
      );
    });
  });

  describe('listData selector', () => {
    let cb;
    let preSelectors;
    beforeAll(() => {
      ({ cb, preSelectors } = listData);
    });
    it('is a emmoized selector based on submissions.allSubmissions', () => {
      expect(preSelectors).toEqual([simpleSelectors.allSubmissions]);
    });
    describe('return data', () => {
      const submissions = [
        {
          gradeStatus: 'gradeStatus1',
          lockStatus: lockStatuses.locked,
          otherValues: 'some stuff 1',
          submissionDate: 3,
        },
        {
          gradeStatus: 'gradeStatus2',
          lockStatus: lockStatuses.unlocked,
          otherValues: 'some stuff2',
          submissionDate: 1,
        },
        {
          gradeStatus: 'gradeStatus1',
          lockStatus: lockStatuses.locked,
          otherValues: 'some stuff 3',
          submissionDate: 2,
        },
      ];
      const allSubmissions = {
        'test-submission-1': submissions[0],
        'test-submission-2': submissions[1],
        'test-submission-3': submissions[2],
      };
      let output;
      beforeAll(() => {
        output = cb(allSubmissions);
      });
      test('is ordered by submissionDate and includes only gradingStatus, submissionDate, and otherValues', () => {
        expect(output[0].otherValues).toEqual(submissions[1].otherValues);
        expect(output[1].otherValues).toEqual(submissions[2].otherValues);
        expect(output[2].otherValues).toEqual(submissions[0].otherValues);
        output.forEach(sub => {
          expect(Object.keys(sub)).toEqual(
            ['gradingStatus', 'otherValues', 'submissionDate'],
          );
        });
      });
      test('returns gradingStatus as GradeStatus iff lockStatus is lock, else lockStatus', () => {
        expect(output[0].gradingStatus).toEqual(submissions[1].gradeStatus);
        expect(output[1].gradingStatus).toEqual(submissions[2].lockStatus);
        expect(output[2].gradingStatus).toEqual(submissions[0].lockStatus);
      });
    });
  });

  describe('isEmptySubmissionData', () => {
    const { cb, preSelectors } = isEmptySubmissionData;
    const emptySubmission = [];
    const noneEmptySubmission = ['some submission'];

    it('is a emmoized selector based on submissions.listData', () => {
      expect(preSelectors).toEqual([listData]);
    });

    it('returns true on empty submission', () => {
      expect(cb(emptySubmission)).toEqual(true);
    });

    it('return false if submission is not empty', () => {
      expect(cb(noneEmptySubmission)).toEqual(false);
    });
  });
});
