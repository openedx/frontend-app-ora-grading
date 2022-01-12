import { feedbackRequirement, lockStatuses } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

// Test state for grading
const testState = {
  grading: {
    selected: [1,2,3,4],
    activeIndex: 1,
    current: 'current',
    gradeData: 'grade data',
    gradingData: 'grading data',
  }
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
    args,expected,
  }) => {
    expect (selector.preSelectors).toEqual(preSelectors);
    expect(selector.cb(args)).toEqual(expected);
  };
  describe('selectionLength selector', () => {
    const { simpleSelectors, selectionLength } = selectors;
    it('returns the number of items selected', () => {
      testReselect({
        selector: selectionLength,
        preSelectors: [simpleSelectors.selected],
        args: testState.grading.selected,
        expected: 4
      }); 
    });
  });
});
