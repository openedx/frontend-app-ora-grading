import { feedbackRequirement } from 'data/services/lms/constants';

// import * in order to mock in-file references
import * as selectors from './selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

// Need to capture correct test state for submissions
const testState = {
  allSubmissions: {},
};

describe('submission selectors unit tests', () => {
  const { simpleSelector, listData } = selectors;
  describe('simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const { preSelectors, cb } = simpleSelectors[key];
      //expect(preSelectors).toEqual([appSelector]);
      expect(cb(testState.allSubmissions)).toEqual(testState.allSubmissions[key]);
    };
    test('simple selector link their values from allSubmissions store', () => {
      testSimpleSelector('allSubmissions')
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
  describe('submissions listData selector', () => {
    const { oraSubmissions } = testState.allSubmissions;
    const testSubmissionListDataSelector = (selector, expected) => (
      testReselect({
        selector,
        preSelectors: [simpleSelectors.oraSubmissions],
        args: oraMetadata,
        expected,
      })
    );
    test('submissions selector returns list of sbumisssions for chosen ORA', () => {
      testOraSelector(selectors.ora.name, oraMetadata.name);
    });
  });
});
