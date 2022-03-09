import { feedbackRequirement, lockStatuses, gradeStatuses } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';
import * as submissionsSelectors from '../submissions/selectors';
import * as appSelectors from '../app/selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

// Test state for grading
const current = {
  gradeStatus: gradeStatuses.ungraded,
  lockStatus: lockStatuses.unlocked,
  response: 'response1',
};

const mockGradeData = (uuid, empty) => {
  const details = `grade data details ${uuid}`;
  return empty ? { details } : {
    details,
    criteria: `criteria ${uuid}`,
    score: `score ${uuid}`,
    overallFeedback: `overall feedback ${uuid}`,
  };
};
const mockGradingData = (uuid, empty) => {
  const out = {
    details: `details ${uuid}`,
    showValidation: !empty,
    overallFeedback: empty ? '' : `overall feedback ${uuid}`,
  };
  return empty ? out : { ...out, criteria: `criteria ${uuid}` };
};

const submissionUUIDs = [
  'submissionUUID1',
  'submissionUUID2',
  'submissionUUID3',
  'submissionUUID4',
];
const gradeData = {
  [submissionUUIDs[0]]: mockGradeData(submissionUUIDs[0], false),
  [submissionUUIDs[1]]: mockGradeData(submissionUUIDs[1], true),
  [submissionUUIDs[2]]: mockGradeData(submissionUUIDs[2], false),
  [submissionUUIDs[3]]: mockGradeData(submissionUUIDs[3], false),
};
const gradingData = {
  [submissionUUIDs[0]]: mockGradingData(submissionUUIDs[0], false),
  [submissionUUIDs[1]]: mockGradingData(submissionUUIDs[1], true),
  [submissionUUIDs[2]]: mockGradingData(submissionUUIDs[2], false),
  [submissionUUIDs[3]]: mockGradingData(submissionUUIDs[3], false),
};
const testState = {
  grading: {
    selected: submissionUUIDs,
    activeIndex: 1,
    current,
    gradeData,
    gradingData,
  },
  submissions: { allSubmissions: 'allSubmissions' },
};

const testValue = 'some test data';

describe('gradingStatusTransform', () => {
  it('returns gradeStatus if unlocked', () => {
    expect(selectors.gradingStatusTransform({
      gradeStatus: testValue,
      lockStatus: lockStatuses.unlocked,
    })).toEqual(testValue);
    expect(selectors.gradingStatusTransform({
      gradeStatus: testValue,
      lockStatus: lockStatuses.locked,
    })).toEqual(lockStatuses.locked);
  });
});

describe('grading selectors unit tests', () => {
  const { rootSelector, rootKeys, simpleSelectors } = selectors;
  describe('rootSelector', () => {
    test('returns grading object from root test state', () => {
      expect(rootSelector({ grading: testValue })).toEqual(testValue);
    });
  });
  describe('grading simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const { preSelectors, cb } = simpleSelectors[key];
      expect(preSelectors).toEqual([rootSelector]);
      expect(cb({ [key]: testValue })).toEqual(testValue);
    };
    test('simple selectors link their values from grading', () => {
      [
        rootKeys.selected,
        rootKeys.activeIndex,
        rootKeys.current,
        rootKeys.gradeData,
        rootKeys.gradingData,
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
      const selected = submissionUUIDs;
      testReselect({
        selector: selectionLength,
        preSelectors: [simpleSelectors.selected],
        args: [selected],
        expected: selected.length,
      });
    });
  });
  describe('selected.submissionUUID selector', () => {
    it('returns the UUID of the selected submission', () => {
      const submissionUUID = submissionUUIDs[2];
      const activeIndex = 'test index';
      const selected = { [activeIndex]: 'test submission id' };
      const submissions = {
        [selected[activeIndex]]: { submissionUUID },
      };
      testReselect({
        selector: selectors.selected.submissionUUID,
        preSelectors: [
          selectors.simpleSelectors.selected,
          submissionsSelectors.simpleSelectors.allSubmissions,
          selectors.simpleSelectors.activeIndex,
        ],
        args: [selected, submissions, activeIndex],
        expected: submissionUUID,
      });
    });
  });
  describe('selected.gradeStatus selector', () => {
    it('returns the grade status of current item', () => {
      testReselect({
        selector: selectors.selected.gradeStatus,
        preSelectors: [simpleSelectors.current],
        args: [{ gradeStatus: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.lockStatus selector', () => {
    it('returns the lock status of selected item', () => {
      testReselect({
        selector: selectors.selected.lockStatus,
        preSelectors: [simpleSelectors.current],
        args: [{ lockStatus: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.response selector', () => {
    it('returns the response for the selected item', () => {
      testReselect({
        selector: selectors.selected.response,
        preSelectors: [simpleSelectors.current],
        args: [{ response: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.gradingStatus selector', () => {
    let transform;
    beforeAll(() => {
      transform = selectors.gradingStatusTransform;
      selectors.gradingStatusTransform = ({ gradeStatus, lockStatus }) => ({
        gradingStatusTransform: { gradeStatus, lockStatus },
      });
    });
    afterAll(() => {
      selectors.gradingStatusTransform = transform;
    });
    it('returns the grading status for the selected item', () => {
      const gradeStatus = 'gradeSTATUS';
      const lockStatus = 'LOCKstatus';
      testReselect({
        selector: selectors.selected.gradingStatus,
        preSelectors: [
          selectors.selected.gradeStatus,
          selectors.selected.lockStatus,
        ],
        args: [gradeStatus, lockStatus],
        expected: lockStatus,
      });
    });
  });
  describe('selected.isGrading selector', () => {
    const { isGrading } = selectors.selected;
    it('is a reselect selector based on gradingStatus', () => {
      expect(isGrading.preSelectors).toEqual([selectors.selected.gradingStatus]);
    });
    it('returns false if grading is not in progress', () => {
      expect(isGrading.cb(lockStatuses.locked)).toEqual(false);
      expect(isGrading.cb(lockStatuses.unlocked)).toEqual(false);
    });
    it('returns true if grading is in progress', () => {
      expect(isGrading.cb(lockStatuses.inProgress)).toEqual(true);
    });
  });
  describe('selected.staticData selector', () => {
    const submissionUUID = submissionUUIDs[1];
    const submission = {
      grade: `grade ${submissionUUID}`,
      gradeStatus: `gradeStatus ${submissionUUID}`,
      static1: `some static data ${submissionUUID}`,
      static2: `other static data ${submissionUUID}`,
    };
    it('returns the static data for the selected item', () => {
      testReselect({
        selector: selectors.selected.staticData,
        preSelectors: [
          selectors.selected.submissionUUID,
          submissionsSelectors.simpleSelectors.allSubmissions,
        ],
        args: [submissionUUID, { [submissionUUID]: submission }],
        expected: { static1: submission.static1, static2: submission.static2 },
      });
    });
  });
  describe('selected.username selector', () => {
    it('returns the username associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.username,
        preSelectors: [selectors.selected.staticData],
        args: [{ username: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.teamName selector', () => {
    it('returns the team name associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.teamName,
        preSelectors: [selectors.selected.staticData],
        args: [{ teamName: testValue }],
        expected: testValue,
      });
    });
  });
  describe('selected.userDisplay selector', () => {
    const { userDisplay } = selectors.selected;
    const username = 'USERname';
    const teamName = 'teamNAME';
    it('is a reselect selector based on the username, teamname, and whether the ORA is individual', () => {
      expect(userDisplay.preSelectors).toEqual([
        appSelectors.ora.isIndividual,
        selectors.selected.username,
        selectors.selected.teamName,
      ]);
    });
    it('returns the username if is an individual ora', () => {
      expect(userDisplay.cb(true, username, teamName)).toEqual(username);
    });
    it('returns the username if is not an individual ora', () => {
      expect(userDisplay.cb(false, username, teamName)).toEqual(teamName);
    });
  });
  describe('selected.gradeData selector', () => {
    it('returns the grade data associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.gradeData,
        preSelectors: [selectors.selected.submissionUUID, selectors.simpleSelectors.gradeData],
        args: ['submissionUUID2', gradeData],
        expected: { details: 'grade data details submissionUUID2' },
      });
    });
  });
  describe('selected.gradingData selector', () => {
    it('returns the grading data associated with the selected item', () => {
      testReselect({
        selector: selectors.selected.gradingData,
        preSelectors: [selectors.selected.submissionUUID, selectors.simpleSelectors.gradingData],
        args: ['submissionUUID2', gradingData],
        expected: {
          details: 'details submissionUUID2',
          overallFeedback: '',
          showValidation: false,
        },
      });
    });
  });
  describe('selected.criteriaGradeData selector', () => {
    const { criteriaGradeData } = selectors.selected;
    const preSelectors = [
      selectors.selected.isGrading,
      selectors.selected.gradeData,
      selectors.selected.gradingData,
    ];
    const local = { criteria: 'criteria1' };
    const remote = { criteria: 'criteria2' };

    it('has the correct pre-selectors', () => {
      expect(criteriaGradeData.preSelectors).toEqual(preSelectors);
    });
    it('returns the criteria grade data associated with the selected item from grading data', () => {
      expect(criteriaGradeData.cb(false, local, remote)).toEqual('criteria1');
    });
    it('returns the criteria grade data associated with the selected item from grade data', () => {
      expect(criteriaGradeData.cb(true, local, remote)).toEqual('criteria2');
    });
    it('returns the criteria grade data associated with the selected item with no criteria', () => {
      expect(criteriaGradeData.cb(false, null, null)).toEqual([]);
    });
    it('returns the criteria grading data associated with the selected item with no criteria', () => {
      expect(criteriaGradeData.cb(true, null, null)).toEqual([]);
    });
  });

  describe('selected.score selector', () => {
    const { score } = selectors.selected;
    it('has the correct pre-selectors', () => {
      expect(score.preSelectors).toEqual([selectors.selected.gradeData]);
    });
    it('returns the score associated with the selected item', () => {
      expect(score.cb({ score: 'testValue' })).toEqual('testValue');
    });
    it('returns an empty object if no score associated with the selected item', () => {
      expect(score.cb({ score: {} })).toEqual({});
    });
    it('returns an empty object if no score associated with the selected item', () => {
      expect(score.cb({ score: null })).toEqual({});
    });
  });
  describe('selected.overallFeedback selector', () => {
    const { overallFeedback } = selectors.selected;
    const preSelectors = [
      selectors.selected.isGrading,
      selectors.selected.gradeData,
      selectors.selected.gradingData,
    ];
    const grading = {
      selected: submissionUUIDs,
      activeIndex: 1,
      current,
      gradeData,
      gradingData,
    };
    it('has the correct pre-selectors', () => {
      expect(overallFeedback.preSelectors).toEqual(preSelectors);
    });
    it('returns the overall feedback associated with the selected item from grade data', () => {
      expect(overallFeedback.cb(
        false,
        grading.gradeData.SubmissionUUID2,
        grading.gradeData.SubmissionUUID2,
      )).toEqual('');
    });
    it('returns the overall feedback associated with the selected item, from grading data', () => {
      expect(overallFeedback.cb(
        true,
        grading.gradeData.SubmissionUUID2,
        grading.gradeData.SubmissionUUID2,
      )).toEqual(grading.gradingData.submissionUUID2.overallFeedback);
    });
    it('returns an empty string associated with the selected item with no overall feedback, from gradeData', () => {
      expect(overallFeedback.cb(
        false,
        grading.gradeData.SubmissionUUID2,
        grading.gradeData.SubmissionUUID2,
      )).toEqual(grading.gradingData.submissionUUID2.overallFeedback);
    });
    it('returns the an empty string associated with the selected item with no overall feedback, from gradingData', () => {
      expect(overallFeedback.cb(
        true,
        grading.gradeData.SubmissionUUID2,
        grading.gradeData.SubmissionUUID2,
      )).toEqual('');
    });
  });
  describe('selected.criterionGradeData selector', () => {
    const testState = { state: 'some state'};
    const testOrderNum = 'testOrderNum1';
    let criteriaGradeData;
    beforeAll(() => {
      criteriaCriteriaGrade = selectors.validation.criteriaGradeData;
      selectors.validation.criteriaGradeData = (state, { orderNum }) => 
        ({ orderNum: { state } });
    });
    afterAll(() => {
      selectors.validation.criteriaGradeData = criteriaGradeData;
    });
    
  });
  describe('selected.criterionSelectedOption selector', () => {

  });
  describe('selected.criterionFeedback selector', () => {

  });
  describe('selectors.next selector', () => {
    const { doesExist } = selectors.next;
    it('returns true if there exists a selection after the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 1],
        expected: true,
      });
    });
    it('returns false if there is not a selection after the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 2],
        expected: false,
      });
    });
  });
  describe('selectors.next.doesExist selector', () => {
    const { doesExist } = selectors.next;
    it('returns true if there exists a selection after the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 1],
        expected: true,
      });
    });
    it('returns false if there is not a selection after the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 2],
        expected: false,
      });
    });
  });
  describe('selectors.next.submissionUUID selector', () => {
    const { submissionUUID } = selectors.next;
    it('returns the submissionUUID of the next item', () => {
      testReselect({
        selector: submissionUUID,
        preSelectors: [
          selectors.simpleSelectors.selected,
          selectors.simpleSelectors.activeIndex,
        ],
        args: [[1, 2, 3], 1],
        expected: 3,
      });
    });
    it('returns a null if there is no next item', () => {
      testReselect({
        selector: submissionUUID,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 3],
        expected: null,
      });
    });
  });
  describe('selectors.prev.doesExist selector', () => {
    const { doesExist } = selectors.prev;
    it('returns true if there exists a selection after the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.activeIndex],
        args: [2],
        expected: true,
      });
    });
    it('returns false if there is not a selection prior to the current selected item', () => {
      testReselect({
        selector: doesExist,
        preSelectors: [selectors.simpleSelectors.activeIndex],
        args: [0],
        expected: false,
      });
    });
  });
  describe('selectors.prev.submissionUUID selector', () => {
    const { submissionUUID } = selectors.prev;
    it('returns the submissionUUID of the next item', () => {
      testReselect({
        selector: submissionUUID,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 1],
        expected: 1,
      });
    });
    it('returns a null if there is no next item', () => {
      testReselect({
        selector: submissionUUID,
        preSelectors: [selectors.simpleSelectors.selected, selectors.simpleSelectors.activeIndex],
        args: [[1, 2, 3], 0],
        expected: null,
      });
    });
  });
  const testRubricConfig = {
    feedback: feedbackRequirement.required,
  };
  const testRubricConfigOptional = {
    feedback: feedbackRequirement.optional,
  };
  describe('validation.overallFeedback selector', () => {
    const { overallFeedback } = selectors.validation;
    const preSelectors = [
      selectors.selected.gradingData,
      appSelectors.rubric.config,
    ];
    const grading = {
      selected: submissionUUIDs,
      activeIndex: 1,
      current,
      gradeData,
      gradingData,
    };
    it('has the correct pre-selectors', () => {
      expect(overallFeedback.preSelectors).toEqual(preSelectors);
    });
    it('returns a true if overall feedback is required and exists', () => {
      expect(overallFeedback.cb(
        grading.gradingData.submissionUUID1,
        testRubricConfig,
      )).toEqual(true);
    });
    it('returns a false if overall feedback is required and does not exist', () => {
      expect(overallFeedback.cb(
        grading.gradingData.submissionUUID2,
        testRubricConfig,
      )).toEqual(false);
    });
    it('returns a true if overall feedback is optional', () => {
      expect(overallFeedback.cb(
        grading.gradingData.submissionUUID2,
        testRubricConfigOptional,
      )).toEqual(true);
    });
  });
  describe('validation.overallFeedbackIsInvalid selector', () => {
    const { overallFeedbackIsInvalid } = selectors.validation;
    it('returns a false if overall feedback is invalid, show = true, overallFeedback = true', () => {
      testReselect({
        selector: overallFeedbackIsInvalid,
        preSelectors: [selectors.validation.show, selectors.validation.overallFeedback],
        args: [true, true],
        expected: false,
      });
    });
    it('returns a false if overall feedback is invlalid, show = false, overallFeedback = false', () => {
      testReselect({
        selector: overallFeedbackIsInvalid,
        preSelectors: [selectors.validation.show, selectors.validation.overallFeedback],
        args: [false, false],
        expected: false,
      });
    });
    it('returns a true if overall feedback is invalid, show = true, overallFeedback = false', () => {
      testReselect({
        selector: overallFeedbackIsInvalid,
        preSelectors: [selectors.validation.show, selectors.validation.overallFeedback],
        args: [true, false],
        expected: true,
      });
    });
    it('returns a false if overall feedback is invalid, show = false, overallFeedback = true ', () => {
      testReselect({
        selector: overallFeedbackIsInvalid,
        preSelectors: [selectors.validation.show, selectors.validation.overallFeedback],
        args: [false, true],
        expected: false,
      });
    });
  });
  const testCriteria = {
    criteria: [
      {
        name: 'Ideas',
        selectedOption: 'Fair',
        feedback: feedbackRequirement.required,
      },
      {
        name: 'Content',
        selectedOption: 'Poor',
        feedback: feedbackRequirement.optional,
      },
    ],
  };
  const testCriteriaInvalid = [
    {
      name: 'Ideas',
      selectedOption: 'Fair',
      feedback: 'some feedback for ideas',
    },
    {
      name: 'Content',
      selectedOption: '',
      feedback: 'feedback for content',
    },
  ];
  describe('validation.criteria selector', () => {
    const { criteria } = selectors.validation;
    describe('returned object', () => {
      let cb;
      beforeEach(() => {
        cb = criteria.cb;
      });
      describe('feedback', () => {
        const validFeedback = { feedback: 'Fair' };
        const emptyFeedback = { feedback: '' };
        const feedbackOptional = { feedback: feedbackRequirement.optional };
        const feedbackRequired = { feedback: feedbackRequirement.required };
        it('returns true iff feedback is required and not provided', () => {
          const output = cb(
            { criteria: [validFeedback, validFeedback, emptyFeedback] },
            { criteria: [feedbackOptional, feedbackRequired, feedbackRequired] },
          );
          expect(output.map(({ feedback }) => feedback)).toEqual([true, true, false]);
        });
      });
      describe('selectedOption', () => {
        it('returns true iff selectedOption is empty', () => {
          const output = cb(
            { criteria: [{ selectedOption: 'Fair' }, { selectedOption: '' }] },
            {},
          );
          expect(output.map(({ selectedOption }) => selectedOption)).toEqual([false, true]);
        });
      });
    });
  });
  describe('validation.criterion selector', () => {
    const testLocalState = { some: 'state' };
    const testVal = 'my Test value!!!';
    const testOrderNum = 'myORDERnum';
    let criteria;
    beforeAll(() => {
      criteria = selectors.validation.criteria;
      selectors.validation.criteria = (state) => ({ [testOrderNum]: { state, testVal } });
    });
    afterAll(() => {
      selectors.validation.criteria = criteria;
    });
    it('returns the <orderNum> key value from the criteria selector data', () => {
      expect(
        selectors.validation.criterion(testLocalState, { orderNum: testOrderNum }),
      ).toEqual({ state: testLocalState, testVal });
    });
  });
  describe('validation.criterionFeedback', () => {
    const testLocalState = { some: 'state' };
    const testOrderNum = 'myORDERnum';

  });
  describe('validation.criterionFeedbackIsInvalid selector', () => {
    const testLocalState = { some: 'state' };
    const testOrderNum = 'myORDERnum';
    let show;
    let criterionFeedback;
    const mockMethods = (show, feedback) => {
      selectors.validation.show = () => show;
      selectors.validation.criterionFeedback = () => feedback;
    };
    beforeAll(() => {
      show = selectors.validation.show;
      criterionFeedback = selectors.validation.criterionFeedback;
    });
    afterAll(() => {
      selectors.validation.show = show;
      selectors.validation.criterionFeedback = criterionFeedback;
    });
    it('returns true if criterionFeedback is not set and validation is set to be shown', () => {
      mockMethods(true, null);
      expect(selectors.validation.criterionFeedbackIsInvalid(testLocalState, { orderNum: testOrderNum })
      ).toEqual(true);
    });
    it('returns false if criterion feedback is set, even is validation is set to be shown', () => {
      mockMethods(true, 'mock feedback');
      expect(
        selectors.validation.criterionFeedbackIsInvalid(testLocalState, { orderNum: testOrderNum }),
      ).toEqual(false);
    });
    it('returns false if validation.show is false, even if criterionFeedback is not set', () => {
      mockMethods(false, null);
      expect(selectors.validation.criterionFeedbackIsInvalid(
        testLocalState, { orderNum: testOrderNum },
      )).toEqual(false);
    });
  });
  describe('validation.criterionSelectedOption selector', () => {
    const testOrderNum = 'testOrder1';
    const testLocalState = { 'testOrder1': { some: 'state' }};
    let criterion;
    beforeAll(() => {
      criterion = selectors.validation.criterion;
      selectors.validation.criterion = (state, { orderNum } ) => ({ 
        selectedOption: { state, orderNum }
      });
    });
    afterAll(() => {
      selectors.validation.criterion = criterion;
    });
    it('returns the selected option for a criterion', () => {
      const params = { orderNum: testOrderNum};
      expect(
        selectors.validation.criterionSelectedOption(testLocalState, params),
      ).toEqual({ state: testLocalState, orderNum: testOrderNum });
    });
  });
  describe('validation.criterionSelectedOptionIsInvalid selector', () => {
    const testLocalState = { some: 'state' };
    const testOrderNum = 'myORDERnum';
    let show;
    let criterionSelectedOption;
    const mockMethods = (show, selected) => {
      selectors.validation.show = () => show;
      selectors.validation.criterionSelectedOption = () => selected;
    };
    beforeAll(() => {
      show = selectors.validation.show;
      criterionSelectedOption = selectors.validation.criterionSelectedOption;
    });
    afterAll(() => {
      selectors.validation.show = show;
      selectors.validation.criterionSelectedOption = criterionSelectedOption;
    });
    it('criterion selected option - show: true, criterionSelectedOption: false, returns true', () => {
      mockMethods(true, false);
      expect(
        selectors.validation.criterionSelectedOptionIsInvalid(testLocalState, { orderNum: testOrderNum }),
      ).toEqual(true);
    });
    it('criterion selected option - show: false, criterionSelectedOption: false, returns false', () => {
      mockMethods(false, false);
      expect(
        selectors.validation.criterionSelectedOptionIsInvalid(testLocalState, { orderNum: testOrderNum }),
      ).toEqual(false);
    });
    it('criterion selected option - show: true, criterionSelectedOption: true, returns false', () => {
      mockMethods(true, true);
      expect(
        selectors.validation.criterionSelectedOptionIsInvalid(testLocalState, { orderNum: testOrderNum }),
      ).toEqual(false);
    });
    it('criterion selected option - show: false, criterionSelectedOption: true, returns false', () => {
      mockMethods(false, true);
      expect(
        selectors.validation.criterionSelectedOptionIsInvalid(testLocalState, { orderNum: testOrderNum }),
      ).toEqual(false);
    });
  });
  describe('validation.isValidForSubmit selector', () => {
    const { isValidForSubmit } = selectors.validation;
    const testOverallFeedback = 'Almost done with unit tests';
    const preSelectors = [
      selectors.validation.overallFeedback, 
      selectors.validation.criteria
    ];
    it('had the right preselectors', () => {
      expect(isValidForSubmit.preSelectors).toEqual(preSelectors);
    });
    it('returns true if there is overall feedback and a selectedOption for each criterion', () => {
      expect(
        isValidForSubmit.cb(testOverallFeedback, testCriteria.criteria)
      ).toEqual(true);
    });
    it('returns false if there is no overall feedback', () => {
      expect(
        isValidForSubmit.cb(false, testCriteria)
      ).toEqual(false);
    });
    it('returns false if there is overall feedback but not a selectedOption for each criterion', () => {
      expect(
        isValidForSubmit.cb(testOverallFeedback, testCriteriaInvalid)
      ).toEqual(false);
    });
  });
});
