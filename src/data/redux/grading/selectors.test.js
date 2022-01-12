// Temporarily disable eslint until the Unit tests are written that use these variables
// eslint-disable-next-line no-unused-vars
import { feedbackRequirement, lockStatuses } from 'data/services/lms/constants';

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
      gradeStatus: 'grade status',
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
      submission1: { submissionUUID: 'unique1' },
      submission2: { submissionUUID: 'unique2' },
      submission3: { submissionUUID: 'unique3' },
      submission4: { submissionUUID: 'unique4' },
    },
  },
};

describe('grading selectors unit tests', () => {
  const { simpleSelectors } = selectors;
  describe('grading simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const { preSelectors, cb } = simpleSelectors[key];
      expect(preSelectors).toEqual([]);
      expect(cb(testState)).toEqual(testState.grading[key]);
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
    expect(selector.cb(args)).toEqual(expected);
  };
  describe('selectionLength selector', () => {
    const { selectionLength } = selectors;
    it('returns the number of items selected', () => {
      testReselect({
        selector: selectionLength,
        preSelectors: [simpleSelectors.selected],
        args: testState.grading.selected,
        expected: 4,
      });
    });
  });
  /* describe('submissionUUID selector', () => {
    const { submissionUUID } = selectors.selected;
    it('returns the UUID of the selected submission', () => {
      console.debug('Output of selected: ' + testState.grading.selected);
      //console.debug('Ouptupt of allSubmissions: ' + JSON.stringify(submissionsSelectors.allSubmissions));
      testReselect({
        selector: submissionUUID,
        preSelectors: [simpleSelectors.selected, submissionsSelectors.allSubmissions, simpleSelectors.activeIndex],
        args: testState,
        expected: 'unique1',
      });
    });
  });*/
  describe('selected.gradeStatus selector', () => {
    const { gradeStatus } = selectors.selected;
    it('returns the grade status of current item', () => {
      testReselect({
        selector: gradeStatus,
        preSelectors: [simpleSelectors.current],
        args: testState.grading.current,
        expected: 'grade status',
      });
    });
  });
  describe('selected.lockStatus selector', () => {
    const { lockStatus } = selectors.selected;
    it('returns the lock status of selected item', () => {
      testReselect({
        selector: lockStatus,
        preSelectors: [simpleSelectors.current],
        args: testState.grading.current,
        expected: 'unlocked',
      });
    });
  });
  describe('selected.response selector', () => {
    const { response } = selectors.selected;
    it('returns the response for the selected item', () => {
      testReselect({
        selector: response,
        preSelectors: [simpleSelectors.current],
        args: testState.grading.current,
        expected: 'response1',
      });
    });
  });
  /* TODO describe('selected.gradingStatus selector', () => {
    const { gradingStatus } = selectors.selected;
    it('returns the grading status for the selected item', () => {
      testReselect({
        selector: gradingStatus,
        preSelectors: [selectors.selected.gradeStatus, selectors.selected.lockStatus],
        args: [testState.grading.current.gradeStatus, testState.grading.current.lockStatus],
        expected: 'response1',
      });
    });
  });*/
  /* TODO describe('selected.isGrading selector', () => {
    const { isGrading } = selectors.selected;
    it('returns true or false is grading is in progress or not for the selected item', () => {
      testReselect({
        selector: isGrading,
        preSelectors: [selectors.selected.gradingStatus],
        args: testState.grading.current,
        expected: false,
      });
    });
  });*/
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
