import { screen } from '@testing-library/react';

import { actions, selectors } from 'data/redux';
import {
  RadioCriterion,
  mapDispatchToProps,
  mapStateToProps,
} from './RadioCriterion';
import { renderWithIntl } from '../../testUtils';

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    criterionConfig: jest.fn((...args) => ({
      rubricCriterionConfig: args,
    })),
  },
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    criterionSelectedOption: jest.fn((...args) => ({
      selectedCriterionSelectedOption: args,
    })),
  },
  validation: {
    criterionSelectedOptionIsInvalid: jest.fn((...args) => ({
      selectedCriterionSelectedOptionIsInvalid: args,
    })),
  },
}));

describe('Radio Criterion Container', () => {
  const props = {
    orderNum: 1,
    isGrading: true,
    config: {
      prompt: 'prompt',
      name: 'random name',
      feedback: 'feedback mock',
      options: [
        {
          explanation: 'explanation',
          feedback: 'option feedback',
          label: 'this label',
          name: 'option name',
          points: 1,
        },
        {
          explanation: 'explanation 2',
          feedback: 'option feedback 2',
          label: 'this label 2',
          name: 'option name 2',
          points: 2,
        },
      ],
    },
    data: 'option name',
    setCriterionOption: jest.fn().mockName('this.props.setCriterionOption'),
    isInvalid: false,
  };

  describe('component rendering', () => {
    it('should render radio buttons that are enabled when in grading mode', () => {
      const { container } = renderWithIntl(<RadioCriterion {...props} />);

      const radioButtons = container.querySelectorAll('input[type="radio"]');
      expect(radioButtons.length).toEqual(props.config.options.length);

      radioButtons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should render radio buttons that are disabled when not in grading mode', () => {
      renderWithIntl(<RadioCriterion {...props} isGrading={false} />);

      const radioButtons = screen.queryAllByRole('radio');
      expect(radioButtons.length).toEqual(props.config.options.length);

      radioButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should render an error message when the criterion is invalid', () => {
      const { container } = renderWithIntl(<RadioCriterion {...props} isInvalid />);

      const errorMessage = container.querySelector('.feedback-error-msg');
      expect(errorMessage).toBeInTheDocument();
    });

    it('should not render an error message when the criterion is valid', () => {
      const { container } = renderWithIntl(<RadioCriterion {...props} />);

      const errorMessage = container.querySelector('.feedback-error-msg');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitrary: 'some data' };
    const ownProps = { orderNum: props.orderNum };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState, ownProps);
    });

    it('should properly map config from rubric criterion config selector', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, ownProps),
      );
    });

    it('should properly map data from selected criterion option selector', () => {
      expect(mapped.data).toEqual(
        selectors.grading.selected.criterionSelectedOption(testState, ownProps),
      );
    });

    it('should properly map isInvalid from criterion validation selector', () => {
      expect(mapped.isInvalid).toEqual(
        selectors.grading.validation.criterionSelectedOptionIsInvalid(testState, ownProps),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    it('should map setCriterionOption action to props', () => {
      expect(mapDispatchToProps.setCriterionOption).toEqual(
        actions.grading.setCriterionOption,
      );
    });
  });
});
