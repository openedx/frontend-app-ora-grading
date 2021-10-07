import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  CriterionFeedback,
  mapStateToProps,
  mapDispatchToProps,
} from './CriterionFeedback';

jest.mock('@edx/paragon', () => ({
  Form: {
    Control: () => 'Form.Control',
  },
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      rubric: {
        criterionFeedbackConfig: jest.fn((...args) => ({
          _rubricCriterionFeedbackConfig: args,
        })),
      },
    },
    grading: {
      selected: {
        criterionFeedback: jest.fn((...args) => ({ _criterionFeedback: args })),
        gradeStatus: jest.fn((...args) => ({ _gradeStatus: args })),
      },
    },
  },
}));

describe('Criterion Feedback', () => {
  const props = {
    orderNum: 1,
    config: 'config string',
    isGrading: true,
    value: 'some value',
    gradeStatus: 'ungraded',
    setValue: jest.fn().mockName('this.props.setValue'),
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
        gradeStatus: 'graded',
      });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('is grading', () => {
      expect(el.isEmptyRender()).toEqual(false);
      expect(el.prop('value')).toEqual(props.value);
      expect(el.prop('disabled')).toEqual(false);
    });
    test('is graded', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: 'graded',
      });
      expect(el.prop('value')).toEqual(props.value);
      expect(el.prop('disabled')).toEqual(true);
    });
    test('is ungraded and not grading', () => {
      el.setProps({
        isGrading: false,
      });
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('set value called on change', () => {
      el = shallow(<CriterionFeedback {...props} />);
      el.instance().onChange({
        target: {
          value: 'some value',
        },
      });
      expect(props.setValue).toBeCalledTimes(1);
    });
  });

  describe('mapStateToProps', () => {
    const testState = { abitaryState: 'some data' };
    const additionalArgs = { orderNum: props.orderNum };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState, additionalArgs);
    });

    test('selectors.app.rubric.criterionFeedbackConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionFeedbackConfig(testState, additionalArgs),
      );
    });

    test('selector.grading.selected.criterionFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.criterionFeedback(testState, additionalArgs),
      );
    });

    test('selector.grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(
        selectors.grading.selected.gradeStatus(testState),
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
