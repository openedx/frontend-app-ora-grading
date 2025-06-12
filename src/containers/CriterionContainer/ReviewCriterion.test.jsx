import React from 'react';
import { render } from '@testing-library/react';

import { selectors } from 'data/redux';
import { ReviewCriterion, mapStateToProps } from './ReviewCriterion';

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    criterionConfig: jest.fn((...args) => ({
      rubricCriterionConfig: args,
    })),
  },
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    criterionGradeData: jest.fn((...args) => ({
      selectedCriterionGradeData: args,
    })),
  },
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Review Criterion Container', () => {
  const props = {
    orderNum: 1,
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
    data: {
      selectedOption: 'selected option',
      feedback: 'data feedback',
    },
  };

  describe('component', () => {
    it('renders all criteria options with correct labels and points', () => {
      const { getAllByTestId } = render(<ReviewCriterion {...props} />);

      const optionsElements = getAllByTestId('criteria-option');
      expect(optionsElements.length).toEqual(props.config.options.length);

      props.config.options.forEach((option, index) => {
        const optionElement = optionsElements[index];
        const labelElement = optionElement.querySelector('[data-testid="option-label"]');
        const pointsElement = optionElement.querySelector('[data-testid="option-points"]');

        expect(labelElement.textContent).toEqual(option.label);
        expect(pointsElement.textContent).toEqual('FormattedMessage');
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitrary: 'some data' };
    const ownProps = { orderNum: props.orderNum };
    let mapped;

    beforeEach(() => {
      mapped = mapStateToProps(testState, ownProps);
    });

    it('should map criterion config from state', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, ownProps),
      );
    });

    it('should map criterion grade data from state', () => {
      expect(mapped.data).toEqual(
        selectors.grading.selected.criterionGradeData(testState, ownProps),
      );
    });
  });
});
