import React from 'react';
import { shallow } from 'enzyme';

import { selectors } from 'data/redux';
import { gradeStatuses } from 'data/services/lms/constants';

import { CriterionContainer, mapStateToProps } from '.';

jest.mock('components/InfoPopover', () => 'InfoPopover');
jest.mock('./RadioCriterion', () => 'RadioCriterion');
jest.mock('./CriterionFeedback', () => 'CriterionFeedback');
jest.mock('./ReviewCriterion', () => 'ReviewCriterion');

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    criterionConfig: jest.fn((...args) => ({
      rubricCriterionConfig: args,
    })),
  },
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    gradeStatus: jest.fn((...args) => ({ selectedGradeStatus: args })),
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
          explanation: 'explanation',
          feedback: 'option feedback',
          label: 'this label',
          name: 'option name',
          points: 2,
        },
        {
          explanation: 'explanation 2',
          feedback: 'option feedback 2',
          label: 'this label 2',
          name: 'option name 2',
          points: 1,
        },
      ],
    },
    gradeStatus: gradeStatuses.ungraded,
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
        gradeStatus: gradeStatuses.graded,
      });
      expect(el).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('rendering and all of the option show up', () => {
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.find('.help-popover-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl, i) => {
        expect(optionEl.key()).toEqual(props.config.options[i].name);
        expect(optionEl.text()).toContain(props.config.options[i].explanation);
      });
    });

    test('is ungraded and is grading (Radio criterion get render)', () => {
      const rubricCriteria = el.find('.rubric-criteria');
      expect(rubricCriteria.children(0).name()).toEqual('RadioCriterion');
    });

    test('is ungraded and is not grading (Review criterion get render)', () => {
      el.setProps({
        isGrading: false,
      });
      const rubricCriteria = el.find('.rubric-criteria');
      expect(rubricCriteria.children(0).name()).toEqual('ReviewCriterion');
    });

    test('is graded and is not grading (Radio criterion get render)', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: gradeStatuses.graded,
      });
      const rubricCriteria = el.find('.rubric-criteria');
      expect(rubricCriteria.children(0).name()).toEqual('RadioCriterion');
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitraryState: 'some data' };
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

    test('selectors.grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(
        selectors.grading.selected.gradeStatus(testState),
      );
    });
  });
});
