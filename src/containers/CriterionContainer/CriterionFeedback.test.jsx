import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { actions, selectors } from 'data/redux';
import {
  feedbackRequirement,
  gradeStatuses,
} from 'data/services/lms/constants';
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
  },
  validation: {
    criterionFeedbackIsInvalid: jest.fn((...args) => ({
      selectedFeedbackIsInvalid: args,
    })),
  },
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Criterion Feedback', () => {
  const props = {
    orderNum: 1,
    config: 'config string',
    isGrading: true,
    value: 'criterion value',
    gradeStatus: gradeStatuses.ungraded,
    setValue: jest.fn().mockName('this.props.setValue'),
    isInvalid: false,
  };

  describe('component', () => {
    describe('render', () => {
      it('shows a non-disabled input when grading', () => {
        const { getByTestId } = render(<CriterionFeedback {...props} />);
        const input = getByTestId('criterion-feedback-input');
        expect(input).toBeInTheDocument();
        expect(input).not.toBeDisabled();
        expect(input).toHaveValue(props.value);
      });

      it('shows a disabled input when not grading', () => {
        const { getByTestId } = render(
          <CriterionFeedback {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />,
        );
        const input = getByTestId('criterion-feedback-input');
        expect(input).toBeInTheDocument();
        expect(input).toBeDisabled();
        expect(input).toHaveValue(props.value);
      });

      it('displays an error message when feedback is invalid', () => {
        const { getByTestId } = render(<CriterionFeedback {...props} isInvalid />);
        expect(getByTestId('criterion-feedback-error-msg')).toBeInTheDocument();
      });

      it('does not render anything when config is set to disabled', () => {
        const { container } = render(
          <CriterionFeedback {...props} config={feedbackRequirement.disabled} />,
        );
        expect(container.firstChild).toBeNull();
      });
    });

    describe('behavior', () => {
      it('calls setValue when input value changes', () => {
        const { getByTestId } = render(<CriterionFeedback {...props} />);
        const input = getByTestId('criterion-feedback-input');
        fireEvent.change(input, { target: { value: 'some value' } });
        expect(props.setValue).toHaveBeenCalledWith({
          value: 'some value',
          orderNum: props.orderNum,
        });
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
    it('gets config from selectors.app.rubric.criterionFeedbackConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionFeedbackConfig(testState, ownProps),
      );
    });
    it('gets value from selectors.grading.selected.criterionFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.criterionFeedback(testState, ownProps),
      );
    });
    it('gets isInvalid from selectors.grading.validation.criterionFeedbackIsInvalid', () => {
      expect(mapped.isInvalid).toEqual(
        selectors.grading.validation.criterionFeedbackIsInvalid(
          testState,
          ownProps,
        ),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps actions.grading.setCriterionFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setValue).toEqual(
        actions.grading.setCriterionFeedback,
      );
    });
  });
});
