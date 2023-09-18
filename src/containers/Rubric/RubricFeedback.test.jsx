import React from 'react';
import { shallow } from 'enzyme';

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
    el.instance().onChange = jest.fn().mockName('this.onChange');
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('is graded', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: gradeStatuses.graded,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });

    test('feedback value is invalid', () => {
      el.setProps({
        isInvalid: true,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });

    test('is configure to disabled', () => {
      el.setProps({
        config: feedbackRequirement.disabled,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('render', () => {
      test('is grading (everything show up and the input is editable)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        const input = el.find('.rubric-feedback.feedback-input');
        expect(input.prop('disabled')).toEqual(false);
        expect(input.prop('value')).toEqual(props.value);
      });

      test('is graded (the input are disabled)', () => {
        el.setProps({
          isGrading: false,
          gradeStatus: gradeStatuses.graded,
        });
        expect(el.isEmptyRender()).toEqual(false);
        const input = el.find('.rubric-feedback.feedback-input');
        expect(input.prop('disabled')).toEqual(true);
        expect(input.prop('value')).toEqual(props.value);
      });

      test('is having invalid feedback (feedback get render)', () => {
        el.setProps({
          isInvalid: true,
        });
        const feedbackErrorEl = el.find('.feedback-error-msg');
        expect(el.instance().props.isInvalid).toEqual(true);
        expect(feedbackErrorEl).toBeDefined();
      });

      test('is configure to disabled (this input does not get render)', () => {
        el.setProps({
          config: feedbackRequirement.disabled,
        });
        expect(el.isEmptyRender()).toEqual(true);
      });
    });
    describe('behavior', () => {
      test('onChange set value', () => {
        el = shallow(<RubricFeedback {...props} />);
        el.instance().onChange({
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
