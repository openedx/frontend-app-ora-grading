import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { actions, selectors } from 'data/redux';
import {
  feedbackRequirement,
  gradeStatuses,
} from 'data/services/lms/constants';

import { formatMessage } from 'testUtils';

import {
  RubricFeedback,
  mapDispatchToProps,
  mapStateToProps,
} from './RubricFeedback';

jest.mock('components/InfoPopover', () => 'InfoPopover');

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    feedbackConfig: jest.fn((...args) => ({
      rubricFeedbackConfig: args,
    })),
    feedbackPrompt: jest.fn((...args) => ({
      rubricFeedbackPrompt: args,
    })),
  },
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    overallFeedback: jest.fn((...args) => ({
      selectedOverallFeedback: args,
    })),
    isGrading: jest.fn((...args) => ({ isGrading: args })),
  },
  validation: {
    overallFeedbackIsInvalid: jest.fn((...args) => ({
      selectedOverallFeedbackIsInvalid: args,
    })),
  },
}));

describe('Rubric Feedback component', () => {
  const props = {
    intl: { formatMessage },
    config: 'config string',
    isGrading: true,
    value: 'some value',
    isInvalid: false,
    feedbackPrompt: 'feedback prompt',
    gradeStatus: gradeStatuses.ungraded,
    setValue: jest.fn().mockName('this.props.setValue'),
  };

  let el;
  beforeEach(() => {
    el = shallow(<RubricFeedback {...props} />);
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('is graded', () => {
      el = shallow(<RubricFeedback {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />);
      expect(el.snapshot).toMatchSnapshot();
    });

    test('feedback value is invalid', () => {
      el = shallow(<RubricFeedback {...props} isInvalid />);
      expect(el.snapshot).toMatchSnapshot();
    });

    test('is configure to disabled', () => {
      el = shallow(<RubricFeedback {...props} config={feedbackRequirement.disabled} />);
      expect(el.snapshot).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('render', () => {
      test('is grading (everything show up and the input is editable)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        const input = el.instance.children[1];
        expect(input.props.disabled).toEqual(false);
        expect(input.props.value).toEqual(props.value);
      });

      test('is graded (the input are disabled)', () => {
        el = shallow(<RubricFeedback {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />);
        expect(el.isEmptyRender()).toEqual(false);
        const input = el.instance.children[1];
        expect(input.props.disabled).toEqual(true);
        expect(input.props.value).toEqual(props.value);
      });

      test('is having invalid feedback (feedback get render)', () => {
        el = shallow(<RubricFeedback {...props} isInvalid />);
        const feedbackErrorEl = el.instance.children[2];
        expect(feedbackErrorEl.props.type).toBe('invalid');
        expect(feedbackErrorEl.props.className).toBe('feedback-error-msg');
        expect(feedbackErrorEl).toBeTruthy();
      });

      test('is configure to disabled (this input does not get render)', () => {
        el = shallow(<RubricFeedback {...props} config={feedbackRequirement.disabled} />);
        expect(el.isEmptyRender()).toEqual(true);
      });
    });
    describe('behavior', () => {
      test('onChange set value', () => {
        el = shallow(<RubricFeedback {...props} />);
        el.instance.children[1].props.onChange({
          target: {
            value: 'some value',
          },
        });
        expect(props.setValue).toBeCalledTimes(1);
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitraryState: 'some data' };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('selectors.grading.selected.isGrading', () => {
      expect(mapped.isGrading).toEqual(selectors.grading.selected.isGrading(testState));
    });

    test('selectors.app.rubricFeedbackConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.feedbackConfig(testState),
      );
    });

    test('selectors.grading.selected.overallFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.overallFeedback(testState),
      );
    });

    test('selectors.grading.validation.overallFeedbackIsInvalid', () => {
      expect(mapped.isInvalid).toEqual(
        selectors.grading.validation.overallFeedbackIsInvalid(testState),
      );
    });

    test('selectors.app.rubric.feedbackPrompt', () => {
      expect(mapped.feedbackPrompt).toEqual(
        selectors.app.rubric.feedbackPrompt(testState),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    test('maps actions.grading.setRubricFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setValue).toEqual(
        actions.grading.setRubricFeedback,
      );
    });
  });
});
