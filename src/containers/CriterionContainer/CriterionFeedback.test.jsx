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
import messages from './messages';

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
  },
  validation: {
    criterionFeedbackIsInvalid: jest.fn((...args) => ({
      selectedFeedbackIsInvalid: args,
    })),
  },
}));

describe('Criterion Feedback', () => {
  const props = {
    intl: { formatMessage },
    orderNum: 1,
    config: 'config string',
    isGrading: true,
    value: 'criterion value',
    gradeStatus: gradeStatuses.ungraded,
    setValue: jest.fn().mockName('this.props.setValue'),
    isInvalid: false,
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
        isInvalid: true,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });

    Object.values(feedbackRequirement).forEach((requirement) => {
      test(`feedback is configured to ${requirement}`, () => {
        el.setProps({
          config: requirement,
        });
        expect(el.instance().render()).toMatchSnapshot();
      });
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
          isInvalid: true,
        });
        const feedbackErrorEl = el.find('.feedback-error-msg');
        expect(el.instance().props.isInvalid).toEqual(true);
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

    describe('getter commentMessage', () => {
      test('is grading', () => {
        el.setProps({ config: feedbackRequirement.optional, isGrading: true });
        expect(el.instance().commentMessage).toContain(
          messages.optional.defaultMessage,
        );

        el.setProps({ config: feedbackRequirement.required });
        expect(el.instance().commentMessage).not.toContain(
          messages.optional.defaultMessage,
        );

        expect(el.instance().commentMessage).toContain(
          messages.addComments.defaultMessage,
        );
      });

      test('is not grading', () => {
        el.setProps({ config: feedbackRequirement.optional, isGrading: false });
        expect(el.instance().commentMessage).toContain(
          messages.optional.defaultMessage,
        );

        el.setProps({ config: feedbackRequirement.required });
        expect(el.instance().commentMessage).not.toContain(
          messages.optional.defaultMessage,
        );

        expect(el.instance().commentMessage).toContain(
          messages.comments.defaultMessage,
        );
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitraryState: 'some data' };
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
    test('selector.grading.validation.criterionFeedbackIsInvalid', () => {
      expect(mapped.isInvalid).toEqual(
        selectors.grading.validation.criterionFeedbackIsInvalid(
          testState,
          ownProps,
        ),
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
