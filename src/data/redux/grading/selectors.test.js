// Temporarily disable eslint until the Unit tests are written that use these variables
// eslint-disable-next-line no-unused-vars
import { feedbackRequirement, lockStatuses, gradeStatuses } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';
import * as submissionsSelectors from '../submissions/selectors';
import * as appSelectors from '../app/selectors';

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
    gradeData: {
      submissionUUID1: {
        details: 'some grade data1',
        criteria: ['some', 'grade data', 'criteria'],
        score: {
          raw_score: 89,
        },
        overallFeedback: 'overallFeedback1 grade',
      },
      submissionUUID2: {
        details: 'some grade data2',
        // No criteria case - criteria: [ 'some', 'grade data', 'criteria' ],
        // No score case - score: {
        //  raw_score: 89,
        // },
        // No overall feedback - overallFeedback: 'overallFeedback2 grade',
      },
      submissionUUID3: {
        details: 'some grade data3',
        criteria: ['some', 'grade data', 'criteria'],
        score: {
          raw_score: 71,
        },
        overallFeedback: 'overallFeedback3 grade',
      },
      submissionUUID4: {
        details: 'some grade data4',
        criteria: ['some', 'grade data', 'criteria'],
        score: {
          raw_score: 99,
        },
        overallFeedback: 'overallFeedback4 grade',
      },
    },
    gradingData: {
      showValidation: true,
      submissionUUID1: {
        details: 'some grading data1',
        criteria: ['some', 'grading', 'criteria'],
        overallFeedback: 'overallFeedback1 grading',
      },
      submissionUUID2: {
        details: 'some grading data2',
        // No criteria case - criteria: [ 'some', 'grading', 'criteria' ],
        // No overall feedback - overallFeedback: 'overallFeedback2 grading',
      },
      submissionUUID3: {
        details: 'some grading data3',
        criteria: ['some', 'grading', 'criteria'],
        overallFeedback: 'overallFeedback3 grading',
      },
      submissionUUID4: {
        details: 'some grading data4',
        criteria: ['some', 'grading', 'criteria'],
        overallFeedback: 'overallFeedback4 grading',
      },
    },
  },
  submissions: {
    allSubmissions: {
      submission1: {
        grade: 0,
        gradeStatus: gradeStatuses.ungraded,
        submissionUUID: 'submissionUUID1',
        username: 'user1',
        teamName: 'teamname1',
      },
      submission2: {
        grade: 95,
        gradeStatus: gradeStatuses.graded,
        submissionUUID: 'submissionUUID2',
        username: 'user2',
        teamName: 'teamname2',
      },
      submission3: {
        grade: 0,
        gradeStatus: gradeStatuses.ungraded,
        submissionUUID: 'submissionUUID3',
        username: 'user3',
        teamName: 'teamname3',
      },
      submission4: {
        grade: 90,
        gradeStatus: gradeStatuses.graded,
        submissionUUID: 'submissionUUID4',
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
        expected: 'submissionUUID2',
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
        expected: { submissionUUID: 'submissionUUID1', teamName: 'teamname1', username: 'user1' },
      });
    });
  });
  describe('selected.username selector', () => {
    const { username } = selectors.selected;
    const staticData = { submissionUUID: 'submissionUUID1', teamName: 'teamname1', username: 'user1' };
    it('returns the username associated with the selected item', () => {
      testReselect({
        selector: username,
        preSelectors: [selectors.selected.staticData],
        args: [staticData],
        expected: 'user1',
      });
    });
  });
  describe('selected.teamName selector', () => {
    const { teamName } = selectors.selected;
    const staticData = { submissionUUID: 'submissionUUID1', teamName: 'teamname1', username: 'user1' };
    it('returns the team name associated with the selected item', () => {
      testReselect({
        selector: teamName,
        preSelectors: [selectors.selected.staticData],
        args: [staticData],
        expected: 'teamname1',
      });
    });
  });
  describe('selected.userDisplay selector', () => {
    const { userDisplay } = selectors.selected;
    it('returns either the username associated with the selected item based on ORA settings', () => {
      testReselect({
        selector: userDisplay,
        preSelectors: [
          appSelectors.ora.isIndividual,
          selectors.selected.username,
          selectors.selected.teamName,
        ],
        args: [true, 'user1', 'teamname1'],
        expected: 'user1',
      });
    });
    it('returns either the team name associated with the selected item based on ORA settings', () => {
      testReselect({
        selector: userDisplay,
        preSelectors: [
          appSelectors.ora.isIndividual,
          selectors.selected.username,
          selectors.selected.teamName,
        ],
        args: [false, 'user1', 'teamname1'],
        expected: 'teamname1',
      });
    });
  });
  describe('selected.gradeData selector', () => {
    const { gradeData } = selectors.selected;
    const expectedGradeData = {
      details: 'some grade data2',
      // No criteria case - criteria: [ 'some','criteria' ],
    };
    it('returns the grade data associated with the selected item', () => {
      testReselect({
        selector: gradeData,
        preSelectors: [selectors.selected.submissionUUID, selectors.simpleSelectors.gradeData],
        args: ['submissionUUID2', testState.grading.gradeData],
        expected: expectedGradeData,
      });
    });
  });
  describe('selected.gradingData selector', () => {
    const { gradingData } = selectors.selected;
    const expectedGradingData = {
      details: 'some grading data2',
      // No criteria case - criteria: [ 'some','criteria' ],
    };
    it('returns the grading data associated with the selected item', () => {
      testReselect({
        selector: gradingData,
        preSelectors: [selectors.selected.submissionUUID, selectors.simpleSelectors.gradingData],
        args: ['submissionUUID2', testState.grading.gradingData],
        expected: expectedGradingData,
      });
    });
  });
  describe('selected.criteriaGradeData selector', () => {
    const { criteriaGradeData } = selectors.selected;
    it('returns the criteria grade data associated with the selected item from grade data', () => {
      testReselect({
        selector: criteriaGradeData,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [false, testState.grading.gradeData.submissionUUID1, testState.grading.gradingData.submissionUUID1],
        expected: testState.grading.gradeData.submissionUUID1.criteria,
      });
    });
    it('returns the criteria grade data associated with the selected item from grading data', () => {
      testReselect({
        selector: criteriaGradeData,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [true, testState.grading.gradeData.submissionUUID1, testState.grading.gradingData.submissionUUID1],
        expected: testState.grading.gradingData.submissionUUID1.criteria,
      });
    });
    it('returns the criteria grade data associated with the selected item with no criteria', () => {
      testReselect({
        selector: criteriaGradeData,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [false, testState.grading.gradeData.submissionUUID2, testState.grading.gradingData.submissionUUID2],
        expected: undefined,
      });
    });
    it('returns the criteria grading data associated with the selected item with no criteria', () => {
      testReselect({
        selector: criteriaGradeData,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [true, testState.grading.gradeData.submissionUUID2, testState.grading.gradingData.submissionUUID2],
        expected: undefined,
      });
    });
  });
  describe('selected.score selector', () => {
    const { score } = selectors.selected;
    const expectedScore = {
      raw_score: 89,
    };
    it('returns the score associated with the selected item', () => {
      testReselect({
        selector: score,
        preSelectors: [selectors.selected.gradeData],
        args: [testState.grading.gradeData.submissionUUID1],
        expected: expectedScore,
      });
    });
    it('returns an empty object if no score associated with the selected item', () => {
      testReselect({
        selector: score,
        preSelectors: [selectors.selected.gradeData],
        args: [testState.grading.gradeData.submissionUUID2],
        expected: {},
      });
    });
  });
  describe('selected.overallFeedback selector', () => {
    const { overallFeedback } = selectors.selected;
    it('returns the overall feedback associated with the selected item from grade data', () => {
      testReselect({
        selector: overallFeedback,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [false, testState.grading.gradeData.submissionUUID1, testState.grading.gradingData.submissionUUID1],
        expected: testState.grading.gradeData.submissionUUID1.overallFeedback,
      });
    });
    it('returns the overall feedback associated with the selected item from grading data', () => {
      testReselect({
        selector: overallFeedback,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [true, testState.grading.gradeData.submissionUUID1, testState.grading.gradingData.submissionUUID1],
        expected: testState.grading.gradingData.submissionUUID1.overallFeedback,
      });
    });
    it('returns an empty string associated with the selected item with no criteria, from gradeData', () => {
      testReselect({
        selector: overallFeedback,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [false, testState.grading.gradeData.submissionUUID2, testState.grading.gradingData.submissionUUID2],
        expected: '',
      });
    });
    it('returns the an empty string associated with the selected item with no criteria, from gradingData', () => {
      testReselect({
        selector: overallFeedback,
        preSelectors: [selectors.selected.isGrading, selectors.selected.gradeData, selectors.selected.gradingData],
        args: [true, testState.grading.gradeData.submissionUUID2, testState.grading.gradingData.submissionUUID2],
        expected: '',
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
