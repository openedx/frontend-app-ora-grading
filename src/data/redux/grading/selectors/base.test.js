import * as selectors from './base';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const submissionUUIDs = [
  'submissionUUID1',
  'submissionUUID2',
  'submissionUUID3',
  'submissionUUID4',
];

const testValue = 'some test data';

describe('base grading selectors unit tests', () => {
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
        rootKeys.selection,
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
      const selection = submissionUUIDs;
      testReselect({
        selector: selectionLength,
        preSelectors: [simpleSelectors.selection],
        args: [selection],
        expected: selection.length,
      });
    });
  });
});
