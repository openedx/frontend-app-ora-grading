import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

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
    el.instance.onChange = jest.fn().mockName('this.onChange');
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el.snapshot).toMatchSnapshot();
    });

    test('is graded', () => {
      el = shallow(<CriterionFeedback {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />);
      expect(el.snapshot).toMatchSnapshot();
    });

    test('feedback value is invalid', () => {
      el = shallow(<CriterionFeedback {...props} isInvalid />);
      expect(el.snapshot).toMatchSnapshot();
    });

    Object.values(feedbackRequirement).forEach((requirement) => {
      test(`feedback is configured to ${requirement}`, () => {
        el = shallow(<CriterionFeedback {...props} config={requirement} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
  });

  describe('component', () => {
    describe('render', () => {
      test('is grading (the feedback input is not disabled)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        const controlEl = el.instance.findByTestId('criterion-feedback-input')[0];
        expect(controlEl.props.disabled).toEqual(false);
        expect(controlEl.props.value).toEqual(props.value);
      });
      test('is graded (the input is disabled)', () => {
        el = shallow(<CriterionFeedback {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />);
        const controlEl = el.instance.findByTestId('criterion-feedback-input')[0];
        expect(controlEl.props.disabled).toEqual(true);
        expect(controlEl.props.value).toEqual(props.value);
      });
      test('is having invalid feedback (feedback get render)', () => {
        el = shallow(<CriterionFeedback {...props} isInvalid />);
        const feedbackErrorEl = el.instance.findByTestId('criterion-feedback-error-msg');
        expect(feedbackErrorEl).toBeDefined();
      });
      test('is configure to disabled (the input does not get render)', () => {
        el = shallow(<CriterionFeedback {...props} config={feedbackRequirement.disabled} />);
        expect(el.isEmptyRender()).toEqual(true);
      });
    });

    describe('behavior', () => {
      test('onChange call set value', () => {
        el = shallow(<CriterionFeedback {...props} />);
        el.instance.findByTestId('criterion-feedback-input')[0].props.onChange({
          target: {
            value: 'some value',
          },
        });
        expect(props.setValue).toBeCalledTimes(1);
      });
    });

    describe('getter commentMessage', () => {
      test('is grading', () => {
        let commentMessage;

        el = shallow(<CriterionFeedback {...props} isGrading config={feedbackRequirement.optional} />);
        commentMessage = el.instance.findByTestId('criterion-feedback-input')[0].props.floatingLabel;
        expect(commentMessage).toContain(
          messages.optional.defaultMessage,
        );

        el = shallow(<CriterionFeedback {...props} config={feedbackRequirement.required} />);
        commentMessage = el.instance.findByTestId('criterion-feedback-input')[0].props.floatingLabel;
        expect(commentMessage).not.toContain(
          messages.optional.defaultMessage,
        );

        expect(commentMessage).toContain(
          messages.addComments.defaultMessage,
        );
      });

      test('is not grading', () => {
        let commentMessage;

        el = shallow(<CriterionFeedback {...props} isGrading={false} config={feedbackRequirement.optional} />);
        commentMessage = el.instance.findByTestId('criterion-feedback-input')[0].props.floatingLabel;
        expect(commentMessage).toContain(
          messages.optional.defaultMessage,
        );

        el = shallow(<CriterionFeedback {...props} isGrading={false} config={feedbackRequirement.required} />);
        commentMessage = el.instance.findByTestId('criterion-feedback-input')[0].props.floatingLabel;
        expect(commentMessage).not.toContain(
          messages.optional.defaultMessage,
        );

        expect(commentMessage).toContain(
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
