import React from 'react';
import { shallow } from 'enzyme';

import { actions, selectors } from 'data/redux';
import {
  feedbackRequirement,
  gradeStatuses,
} from 'data/services/lms/constants';
import { formatMessage } from 'testUtils';
import {
  CriterionFeedback,
  mapStateToProps,
  mapDispatchToProps,
} from './CriterionFeedback';

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    criterionFeedbackConfig: jest.fn((...args) => ({
      rubricCriterionFeedbackConfig: args,
    })),
  },
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    criterionFeedback: jest.fn((...args) => ({
      selectedCriterionFeedback: args,
    })),
    criterionFeedbackIsInvalid: jest.fn((...args) => ({ selectedFeedbackIsInvalid: args })),
  },
}));

describe('Criterion Feedback', () => {
  const props = {
    intl: { formatMessage },
    orderNum: 1,
    config: 'config string',
    isGrading: true,
    value: { grading: 'grading value', review: 'review value' },
    gradeStatus: gradeStatuses.ungraded,
    setValue: jest.fn().mockName('this.props.setValue'),
    valueIsInvalid: false,
  };
  let el;
  beforeEach(() => {
    el = shallow(<CriterionFeedback {...props} />);
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
        valueIsInvalid: true,
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
      test('is grading (the feedback input is not disabled)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        expect(el.instance().props.value).toEqual(props.value);
        const controlEl = el.find('.feedback-input');
        expect(controlEl.prop('disabled')).toEqual(false);
        expect(controlEl.prop('value')).toEqual(props.value);
      });
      test('is graded (the input is disabled)', () => {
        el.setProps({
          isGrading: false,
          gradeStatus: gradeStatuses.graded,
        });
        expect(el.instance().props.value).toEqual(props.value);
        const controlEl = el.find('.feedback-input');
        expect(controlEl.prop('disabled')).toEqual(true);
        expect(controlEl.prop('value')).toEqual(props.value);
      });
      test('is having invalid feedback (feedback get render)', () => {
        el.setProps({
          valueIsInvalid: true,
        });
        const feedbackErrorEl = el.find('.feedback-error-msg');
        expect(el.instance().props.valueIsInvalid).toEqual(true);
        expect(feedbackErrorEl).toBeDefined();
      });
      test('is configure to disabled (the input does not get render)', () => {
        el.setProps({
          config: feedbackRequirement.disabled,
        });
        expect(el.isEmptyRender()).toEqual(true);
      });
    });

    describe('behavior', () => {
      test('onChange call set value', () => {
        el = shallow(<CriterionFeedback {...props} />);
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
    const testState = { abitaryState: 'some data' };
    const ownProps = { orderNum: props.orderNum };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState, ownProps);
    });
    test('selectors.app.rubric.criterionFeedbackConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionFeedbackConfig(testState, ownProps),
      );
    });
    test('selector.grading.selected.criterionFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.criterionFeedback(testState, ownProps),
      );
    });
    test('selector.grading.selected.criterionFeedbackIsInvalid', () => {
      expect(mapped.valueIsInvalid).toEqual(
        selectors.grading.selected.criterionFeedbackIsInvalid(testState, ownProps),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    test('maps actions.grading.setCriterionFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setValue).toEqual(
        actions.grading.setCriterionFeedback,
      );
    });
  });
});
