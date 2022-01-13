// Temporarily disable eslint until the Unit tests are written that use these variables
// eslint-disable-next-line no-unused-vars
import { feedbackRequirement, lockStatuses, gradeStatuses } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';
// eslint-disable-next-line no-unused-vars
import * as submissionsSelectors from '../submissions/selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

// Test state for grading
const testState = {
  grading: {
    selected: [
      'submission1',
      'submission2',
      'submission3',
      'submission4',
    ],
    activeIndex: 1,
    current: {
      gradeStatus: gradeStatuses.ungraded,
      lockStatus: lockStatuses.unlocked,
      response: 'response1',
    },
    gradeData: 'grade data',
    gradingData: {
      showValidation: true,
    },
  },
  submissions: {
    allSubmissions: {
      submission1: {
        grade: 0,
        gradeStatus: gradeStatuses.ungraded,
        submissionUUID: 'unique1',
        username: 'user1',
        teamName: 'teamname1',
      },
      submission2: {
        grade: 95,
        gradeStatus: gradeStatuses.graded,
        submissionUUID: 'unique2',
        username: 'user2',
        teamName: 'teamname2',
      },
      submission3: {
        grade: 0,
        gradeStatus: gradeStatuses.ungraded,
        submissionUUID: 'unique3',
        username: 'user3',
        teamName: 'teamname3',
      },
      submission4: {
        grade: 90,
        gradeStatus: gradeStatuses.graded,
        submissionUUID: 'unique4',
        username: 'user4',
        teamName: 'teamname4',
      },
    },
  },
};

describe('grading selectors unit tests', () => {
  const { simpleSelectors } = selectors;
  describe('grading simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const selector = simpleSelectors[key];
      // expect(preSelectors).toEqual([]);
      expect(selector(testState)).toEqual(testState.grading[key]);
    };
    test('simple selectors link their values from grading', () => {
      [
        'selected',
        'activeIndex',
        'current',
        'gradeData',
        'gradingData',
      ].map(testSimpleSelector);
    });
  });
  const testReselect = ({
    selector,
    preSelectors,
    args,
    expected,
  }) => {
    expect(selector.preSelectors).toEqual(preSelectors);
    expect(selector.cb(...args)).toEqual(expected);
  };
  describe('selectionLength selector', () => {
    const { selectionLength } = selectors;
    it('returns the number of items selected', () => {
      testReselect({
        selector: selectionLength,
        preSelectors: [simpleSelectors.selected],
        expected: 4,
        args: [testState.grading.selected],
      });
    });
  });
  describe('submissionUUID selector', () => {
    const { submissionUUID } = selectors.selected;
    const testArguments = [
      testState.grading.selected,
      testState.submissions.allSubmissions,
      testState.grading.activeIndex,
    ];
    it('returns the UUID of the selected submission', () => {
      testReselect({
        selector: submissionUUID,
        preSelectors: [
          selectors.simpleSelectors.selected,
          submissionsSelectors.simpleSelectors.allSubmissions,
          selectors.simpleSelectors.activeIndex,
        ],
        args: testArguments,
        expected: 'unique2',
      });
    });
  });
  describe('selected.gradeStatus selector', () => {
    const { gradeStatus } = selectors.selected;
    it('returns the grade status of current item', () => {
      testReselect({
        selector: gradeStatus,
        preSelectors: [simpleSelectors.current],
        args: [testState.grading.current],
        expected: gradeStatuses.ungraded,
      });
    });
  });
  describe('selected.lockStatus selector', () => {
    const { lockStatus } = selectors.selected;
    it('returns the lock status of selected item', () => {
      testReselect({
        selector: lockStatus,
        preSelectors: [simpleSelectors.current],
        args: [testState.grading.current],
        expected: lockStatuses.unlocked,
      });
    });
  });
  describe('selected.response selector', () => {
    const { response } = selectors.selected;
    it('returns the response for the selected item', () => {
      testReselect({
        selector: response,
        preSelectors: [simpleSelectors.current],
        args: [testState.grading.current],
        expected: 'response1',
      });
    });
  });
  describe('selected.gradingStatus selector', () => {
    const { gradingStatus } = selectors.selected;
    it('returns the grading status for the selected item', () => {
      testReselect({
        selector: gradingStatus,
        preSelectors: [selectors.selected.gradeStatus, selectors.selected.lockStatus],
        args: [testState.grading.current.gradeStatus, testState.grading.current.lockStatus],
        expected: gradeStatuses.ungraded,
      });
    });
  });
  describe('selected.isGrading selector', () => {
    const { isGrading } = selectors.selected;
    it('returns false if grading is not in progress for the selected item', () => {
      testReselect({
        selector: isGrading,
        preSelectors: [selectors.selected.gradingStatus],
        args: testState.grading.current.lockStatus,
        expected: false,
      });
    });
    it('returns true if grading is in progress for the selected item', () => {
      testReselect({
        selector: isGrading,
        preSelectors: [selectors.selected.gradingStatus],
        args: [lockStatuses.inProgress],
        expected: true,
      });
    });
  });
  describe('selected.staticData selector', () => {
    const { staticData } = selectors.selected;
    it('returns the static data for the selected item', () => {
      testReselect({
        selector: staticData,
        preSelectors: [selectors.selected.submissionUUID, submissionsSelectors.simpleSelectors.allSubmissions],
        args: ['submission1', testState.submissions.allSubmissions],
        expected: { submissionUUID: 'unique1', teamName: 'teamname1', username: 'user1' },
      });
    });
  });
  /* describe('validation.show selector', () => {
    const { show } = selectors.validation;
    it('returns a boolean for whether or not validation should be displayed', () => {
      testReselect({
        selector: show,
        preSelectors: [simpleSelectors.gradeData],
        args: testState.grading.gradingData,
        expected: true,
      });
    });
  });*/
});
