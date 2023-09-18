import { feedbackRequirement } from 'data/services/lms/constants';

import { keyStore } from '../../../utils';
// import * in order to mock in-file references
import * as selectors from './selectors';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testState = {
  app: {
    showReview: false,
    showRubric: false,
    isGrading: false,
    courseMetadata: {
      courseId: 'test-course-id',
    },
    oraMetadata: {
      name: 'test-ora-name',
      prompt: 'test-ora-prompt',
      type: 'test-ora-type',
      fileUploadResponseConfig: 'file-upload-response-config',
      rubricConfig: {
        feedback: 'optional',
        criteria: [
          {
            orderNum: 0,
            name: 'critERia0',
            feedback: 'optional',
          },
          {
            orderNum: 1,
            name: 'critEriA1',
            feedback: 'disabled',
          },
          {
            orderNum: 2,
            name: 'cRIteria2',
            feedback: 'required',
          },
        ],
      },
    },
  },
};

const selectorKeys = keyStore(selectors);

describe('app selectors unit tests', () => {
  const { appSelector, simpleSelectors, rubric } = selectors;
  describe('appSelector', () => {
    it('returns the app data', () => {
      expect(appSelector(testState)).toEqual(testState.app);
    });
  });
  describe('simpleSelectors', () => {
    const testSimpleSelector = (key) => {
      const { preSelectors, cb } = simpleSelectors[key];
      expect(preSelectors).toEqual([appSelector]);
      expect(cb(testState.app)).toEqual(testState.app[key]);
    };
    test('simple selectors link their values from app store', () => {
      [
        'showReview',
        'showRubric',
        'isGrading',
        'courseMetadata',
        'oraMetadata',
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
  describe('courseId selector', () => {
    it('returns course id from courseMetadata', () => {
      testReselect({
        selector: selectors.courseId,
        preSelectors: [simpleSelectors.courseMetadata],
        args: testState.app.courseMetadata,
        expected: testState.app.courseMetadata.courseId,
      });
    });
  });
  describe('ora metadata selectors', () => {
    const { oraMetadata } = testState.app;
    const testOraSelector = (selector, expected) => (
      testReselect({
        selector,
        preSelectors: [simpleSelectors.oraMetadata],
        args: oraMetadata,
        expected,
      })
    );
    test('ora.name selector returns name from oraMetadata', () => {
      testOraSelector(selectors.ora.name, oraMetadata.name);
    });
    test('ora.prompt selector returns prompt from oraMetadata', () => {
      testOraSelector(selectors.ora.prompt, oraMetadata.prompt);
    });
    test('ora.type selector returns type from oraMetadata', () => {
      testOraSelector(selectors.ora.type, oraMetadata.type);
    });
    test('rubricConfig selector returns rubricConfig from oraMetadata', () => {
      testOraSelector(selectors.rubric.config, oraMetadata.rubricConfig);
    });
    test('fileUploadResponseConfig returns fileUploadResponseConfig from oraMetadata', () => {
      testOraSelector(
        selectors.ora.fileUploadResponseConfig,
        oraMetadata.fileUploadResponseConfig,
      );
    });
  });
  describe('rubricConfig selectors', () => {
    const { rubricConfig } = testState.app.oraMetadata;
    const testRubricSelector = (selector, expected, args = null) => (
      testReselect({
        selector,
        preSelectors: [selectors.rubric.config],
        args: args === null ? rubricConfig : args,
        expected,
      })
    );
    test('hasConfig', () => {
      testReselect({
        selector: rubric.hasConfig,
        preSelectors: [selectors.rubric.config],
        args: rubricConfig,
        expected: true,
      });
      testReselect({
        selector: rubric.hasConfig,
        preSelectors: [selectors.rubric.config],
        args: undefined,
        expected: false,
      });
    });
    test('feedbackConfig', () => {
      testRubricSelector(rubric.feedbackConfig, rubricConfig.feedback);
    });
    test('criteria', () => {
      testRubricSelector(rubric.criteria, rubricConfig.criteria);
    });
    describe('criteria selectors', () => {
      let criteria;
      beforeEach(() => {
        criteria = rubric.criteria;
        rubric.criteria = jest.fn(({ app }) => app.oraMetadata.rubricConfig.criteria);
      });
      afterEach(() => {
        rubric.criteria = criteria;
      });
      test('criterionConfig returns config by orderNum/index', () => {
        const testCriterion = (orderNum) => {
          expect(
            rubric.criterionConfig(testState, { orderNum }),
          ).toEqual(rubricConfig.criteria[orderNum]);
        };
        [0, 1, 2].map(testCriterion);
      });
      test('criterionFeedbackConfig', () => {
        const testCriterion = (orderNum) => {
          expect(
            rubric.criterionFeedbackConfig(testState, { orderNum }),
          ).toEqual(rubricConfig.criteria[orderNum].feedback);
        };
        [0, 1, 2].map(testCriterion);
      });
      test('criteriaIndices returns ordered list of orderNum values', () => {
        testReselect({
          selector: rubric.criteriaIndices,
          preSelectors: [criteria],
          args: rubricConfig.criteria,
          expected: [0, 1, 2],
        });
      });
    });
  });
  describe('shouldIncludeFeedback', () => {
    it('returns true if the passed feedback is optional or required', () => {
      expect(selectors.shouldIncludeFeedback(feedbackRequirement.optional)).toEqual(true);
      expect(selectors.shouldIncludeFeedback(feedbackRequirement.required)).toEqual(true);
      expect(selectors.shouldIncludeFeedback(feedbackRequirement.disabled)).toEqual(false);
      expect(selectors.shouldIncludeFeedback('arbitrary')).toEqual(false);
    });
  });
  describe('fillGradeData selector', () => {
    const cb = selectors.fillGradeData;
    const spies = {};
    let oldRubric;
    const criteria = [
      { name: 'criteria1', orderNum: 0, feedback: true },
      { name: 'criteria2', orderNum: 1, feedback: false },
      { name: 'criteria3', orderNum: 2, feedback: true },
    ];

    const data = { arbitrary: 'data', criteria };
    beforeAll(() => {
      oldRubric = { ...rubric };
    });
    beforeEach(() => {
      rubric.hasConfig = jest.fn(() => true);
      rubric.feedbackConfig = jest.fn(() => true);
      rubric.criteria = jest.fn(() => criteria);
      spies.shouldIncludeFeedback = jest.spyOn(
        selectors,
        selectorKeys.shouldIncludeFeedback,
      ).mockImplementation(val => val);
    });
    afterEach(() => {
      spies[selectorKeys.shouldIncludeFeedback].mockRestore();
    });
    afterAll(() => {
      selectors.rubric = { ...oldRubric };
    });

    describe('if rubric config is not loaded', () => {
      it('returns passed gradeData', () => {
        rubric.hasConfig.mockReturnValueOnce(false);
        expect(cb(testState, data)).toEqual(data);
      });
    });

    describe('if rubric config is loaded', () => {
      describe('gradeData is passed, contains criteria', () => {
        it('returns the passed gradeData', () => {
          expect(cb(testState, data)).toEqual(data);
        });
      });
      describe('gradeData is not passed', () => {
        it('adds overall feedback iff is configured for inclusion', () => {
          expect(cb(testState, null).overallFeedback).toEqual('');
          rubric.feedbackConfig.mockReturnValueOnce(false);
          expect(cb(testState, null).overallFeedback).toEqual(undefined);
        });
        describe('criteria', () => {
          it('displays name, orderNum, and feedback per config and empty selection', () => {
            expect(cb(testState, null).criteria).toEqual([
              {
                name: criteria[0].name,
                orderNum: criteria[0].orderNum,
                feedback: '',
                selectedOption: '',
              },
              {
                name: criteria[1].name,
                orderNum: criteria[1].orderNum,
                selectedOption: '',
              },
              {
                name: criteria[2].name,
                orderNum: criteria[2].orderNum,
                feedback: '',
                selectedOption: '',
              },
            ]);
          });
        });
      });
    });
  });
});
