import { StrictDict } from 'utils';
import { feedbackRequirement } from 'data/services/lms/constants';

// import * in order to mock in-file references
import selected from './selected';
import * as selectors from './validation';
import * as appSelectors from '../../app/selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testValue = 'MY test VAlue';
const orderNum = 'MYorderNum';

describe('validation grading selectors unit tests', () => {
  const requiredConfig = {
    feedback: feedbackRequirement.required,
  };
  const optionalConfig = {
    feedback: feedbackRequirement.optional,
  };
  describe('validation.overallFeedback selector', () => {
    const selector = selectors.validation.overallFeedback;
    const { preSelectors, cb } = selector;
    it('has the correct pre-selectors', () => {
      expect(preSelectors).toEqual([
        selected.gradingData,
        appSelectors.rubric.config,
      ]);
    });
    describe('feedback is required', () => {
      it('returns true if overallFeedback provided', () => {
        expect(cb({ overallFeedback: testValue }, requiredConfig)).toEqual(true);
      });
      it('returns false if overallFeedback is provided', () => {
        expect(cb({ overallFeedback: '' }, requiredConfig)).toEqual(false);
      });
    });
    it('returns true if overallFeedback is optional', () => {
      expect(cb({ overallFeedback: null }, optionalConfig)).toEqual(true);
    });
  });
  describe('validation.overallFeedbackIsInvalid selector', () => {
    const selector = selectors.validation.overallFeedbackIsInvalid;
    const { preSelectors, cb } = selector;
    test('returns memoized selector based on show and overall feedback validation states', () => {
      expect(preSelectors).toEqual([
        selectors.validation.show,
        selectors.validation.overallFeedback,
      ]);
    });
    it('returns true iff set to show and overallFeedback is invalid', () => {
      expect(cb(false, false)).toEqual(false);
      expect(cb(false, true)).toEqual(false);
      expect(cb(true, true)).toEqual(false);
      expect(cb(true, false)).toEqual(true);
    });
  });
  describe('validation.criteria selector', () => {
    const selector = selectors.validation.criteria;
    const { cb, preSelectors } = selector;
    it('returns memoized selector based on selected gradingData and rubric config', () => {
      expect(preSelectors).toEqual([selected.gradingData, appSelectors.rubric.config]);
    });
    describe('returned object', () => {
      const feedbackOptional = { feedback: feedbackRequirement.optional, options: [1] };
      const feedbackRequired = { feedback: feedbackRequirement.required, options: [1] };
      describe('feedback', () => {
        const validFeedback = { feedback: 'Fair' };
        const emptyFeedback = { feedback: '' };
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
            { criteria: [feedbackOptional, feedbackOptional] },
          );
          expect(output.map(({ selectedOption }) => selectedOption)).toEqual([true, false]);
        });
        it('returns true criteria options are empty', () => {
          const emptyOptionsFeedback = { ...feedbackOptional, options: [] };
          const output = cb(
            { criteria: [{ selectedOption: '' }, { selectedOption: 'Invalid' }] },
            { criteria: [emptyOptionsFeedback, emptyOptionsFeedback] },
          );
          expect(output.map(({ selectedOption }) => selectedOption)).toEqual([true, true]);
        });
      });
    });
  });
  const validationKeys = StrictDict(
    Object.keys(selectors.validation).reduce(
      (obj, key) => ({ ...obj, [key]: key }),
      {},
    ),
  );
  describe('validation.criterion selector', () => {
    const testState = { some: 'state' };
    it('returns the <orderNum> key value from the criteria selector data', () => {
      const OLD = selectors.validation.criteria;
      selectors.validation.criteria = (state) => ({ [orderNum]: state });
      expect(
        selectors.validation.criterion(testState, { orderNum }),
      ).toEqual(testState);
      selectors.validation.criteria = OLD;
    });
  });
  describe('validation.criterionFeedback', () => {
    const testState = {
      [orderNum]: { feedback: 'test feedback' },
    };
    it('returns the feedback for a given criterion of the current selections', () => {
      jest.spyOn(selectors.validation, validationKeys.criterion)
        .mockImplementationOnce((...args) => ({ feedback: args }));
      expect(
        selectors.validation.criterionFeedback(testState, { orderNum }),
      ).toEqual([testState, { orderNum }]);
    });
  });
  describe('validation.criterionFeedbackIsInvalid selector', () => {
    const testState = { some: 'state' };
    const testOrderNum = 'myORDERnum';
    let show;
    let criterionFeedback;
    const selector = selectors.validation.criterionFeedbackIsInvalid;
    const mockMethods = (showValue, feedback) => {
      selectors.validation.show = () => showValue;
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
      expect(selector(testState, { orderNum: testOrderNum })).toEqual(true);
    });
    it('returns false if criterion feedback is set, even is validation is set to be shown', () => {
      mockMethods(true, 'mock feedback');
      expect(selector(testState, { orderNum: testOrderNum })).toEqual(false);
    });
    it('returns false if validation.show is false, even if criterionFeedback is not set', () => {
      mockMethods(false, null);
      expect(selector(testState, { orderNum: testOrderNum })).toEqual(false);
    });
  });
  describe('validation.criterionSelectedOption selector', () => {
    it('returns the selected option for a criterion', () => {
      const testState = { testOrder1: { some: 'state' } };
      const selector = selectors.validation.criterionSelectedOption;
      jest.spyOn(selectors.validation, validationKeys.criterion)
        .mockImplementationOnce((...args) => ({ selectedOption: args }));
      expect(selector(testState, { orderNum })).toEqual([testState, { orderNum }]);
    });
  });
  describe('validation.criterionSelectedOptionIsInvalid selector', () => {
    const testState = { some: 'state' };
    let show;
    const mockMethods = (showValue, selectedValue) => {
      selectors.validation.show = () => showValue;
      selectors.validation.criterionSelectedOption.mockReturnValueOnce(selectedValue);
    };
    const selector = selectors.validation.criterionSelectedOptionIsInvalid;
    beforeAll(() => {
      show = selectors.validation.show;
      jest.spyOn(selectors.validation, validationKeys.criterionSelectedOption);
    });
    afterAll(() => {
      selectors.validation.show = show;
    });
    it('returns true iff configured to show and criterion feedback is invalid', () => {
      const testSelector = (showValue, selectedValue, expected) => {
        selectors.validation.show = () => showValue;
        selectors.validation.criterionSelectedOption.mockReturnValueOnce(selectedValue);
        expect(selector(testState, { orderNum })).toEqual(expected);
      };
      testSelector(false, false, false);
      testSelector(false, true, false);
      mockMethods(true, false, false);
      testSelector(true, true, true);
    });
  });
  describe('validation.isValidForSubmit selector', () => {
    const selector = selectors.validation.isValidForSubmit;
    const { cb, preSelectors } = selector;
    it('had the right preselectors', () => {
      expect(preSelectors).toEqual([
        selectors.validation.overallFeedback,
        selectors.validation.criteria,
      ]);
    });
    it('returns true iff given overall feedback and a selectedOption for each criterion', () => {
      const validResponse = { feedback: 'test1', selectedOption: 'test1' };
      expect(cb('overall feedback', [validResponse])).toEqual(true);
      expect(cb('overall feedback', [{ ...validResponse, feedback: '' }])).toEqual(false);
      expect(cb('overall feedback', [{ ...validResponse, selectedOption: '' }])).toEqual(false);
      expect(cb('', validResponse)).toEqual(false);
    });
  });
});
