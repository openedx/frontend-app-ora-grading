import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { ReviewCriterion, mapStateToProps } from './ReviewCriterion';

jest.mock('@edx/paragon', () => ({
  Form: {
    Label: () => 'Form.Label',
  },
  FormControlFeedback: () => 'FormControlFeedback',
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      rubric: {
        criterionConfig: jest.fn((...args) => ({
          rubricCriterionConfig: args,
        })),
      },
    },
    grading: {
      selected: {
        criterionGradeData: jest.fn((...args) => ({
          selectedCriterionGradeData: args,
        })),
      },
    },
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
          explanation: 'explaination',
          feedback: 'option feedback',
          label: 'this label',
          name: 'option name',
          points: 1,
        },
        {
          explanation: 'explaination 2',
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
    expect(el).toMatchSnapshot();
  });

  describe('component', () => {
    test('rendering', () => {
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.find('.criteria-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl, i) => {
        let option = props.config.options[i];
        expect(optionEl.key()).toEqual(option.name);
        expect(optionEl.find('.option-label').childAt(0).text()).toEqual(
          option.label,
        );
        expect(optionEl.find('.option-points').childAt(0).text()).toContain(
          String(option.points),
        );
      });
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitary: 'some data' };
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
