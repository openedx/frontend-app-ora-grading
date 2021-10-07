import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import { CriterionContainer, mapStateToProps } from '.';

jest.mock('components/InfoPopover', () => 'InfoPopover');
jest.mock('./RadioCriterion', () => 'RadioCriterion');
jest.mock('./CriterionFeedback', () => 'CriterionFeedback');
jest.mock('./ReviewCriterion', () => 'ReviewCriterion');

jest.mock('@edx/paragon', () => ({
  Form: {
    Group: () => 'Form.Group',
    Label: () => 'Form.Label',
  },
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      rubric: {
        criterionConfig: jest.fn((...args) => ({ _criterionConfig: args })),
      },
    },
    grading: {
      selected: {
        gradeStatus: jest.fn((...args) => ({ selectedGradeStatus: args })),
      },
    },
  },
}));

describe('Criterion Container', () => {
  const props = {
    isGrading: true,
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
          points: 2,
        },
        {
          explanation: 'explaination 2',
          feedback: 'option feedback 2',
          label: 'this label 2',
          name: 'option name 2',
          points: 1,
        },
      ],
    },
    gradeStatus: 'ungraded',
  };
  let el;
  beforeEach(() => {
    el = shallow(<CriterionContainer {...props} />);
  });

  describe('snapshot', () => {
    test('is ungraded and is grading', () => {
      expect(el).toMatchSnapshot();
    });

    test('is ungraded and is not grading', () => {
      el.setProps({
        isGrading: false,
      });
      expect(el).toMatchSnapshot();
    });

    test('is graded and is not grading', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: 'graded',
      });
      expect(el).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('rendering', () => {
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.find('.help-popover-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl, i) => {
        expect(optionEl.key()).toEqual(props.config.options[i].name);
        expect(optionEl.text()).toContain(props.config.options[i].explanation);
      });
    });

    test('is ungraded and is grading', () => {
      const rubricCritera = el.find('.rubric-criteria');
      expect(rubricCritera.children(0).name()).toEqual('RadioCriterion');
    });

    test('is ungraded and is not grading', () => {
      el.setProps({
        isGrading: false,
      });
      const rubricCritera = el.find('.rubric-criteria');
      expect(rubricCritera.children(0).name()).toEqual('ReviewCriterion');
    });

    test('is graded and is not grading', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: 'graded',
      });
      const rubricCritera = el.find('.rubric-criteria');
      expect(rubricCritera.children(0).name()).toEqual('RadioCriterion');
    });
  });

  describe('mapStateToProps', () => {
    const testState = { abitaryState: 'some data' };
    const additionalArgs = { orderNum: props.orderNum };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState, additionalArgs);
    });
    test('selectors.app.rubric.criterionConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, additionalArgs),
      );
    });

    test('selectors.grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(
        selectors.grading.selected.gradeStatus(testState),
      );
    });
  });
});
