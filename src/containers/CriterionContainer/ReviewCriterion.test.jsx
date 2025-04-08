import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { selectors } from '@src/data/redux';
import { ReviewCriterion, mapStateToProps } from './ReviewCriterion';
import messages from './messages';

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

describe('Review Crition Container', () => {
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

  let el;
  beforeEach(() => {
    el = shallow(<ReviewCriterion {...props} />);
  });
  test('snapshot', () => {
    expect(el.snapshot).toMatchSnapshot();
  });

  describe('component', () => {
    test('rendering (everything show up)', () => {
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.instance.findByTestId('criteria-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl, i) => {
        const option = props.config.options[i];
        expect(optionEl.props.key).toEqual(option.name);
        expect(optionEl.findByTestId('option-label')[0].children[0].el).toEqual(
          option.label,
        );
        expect(optionEl.findByTestId('option-points')[0].children[0].props).toEqual({
          ...messages.optionPoints,
          values: { points: option.points },
        });
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
    test('selectors.app.rubric.criterionConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, ownProps),
      );
    });

    test('selectors.grading.selected.criterionGradeData', () => {
      expect(mapped.data).toEqual(
        selectors.grading.selected.criterionGradeData(testState, ownProps),
      );
    });
  });
});
