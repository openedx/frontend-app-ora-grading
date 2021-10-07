import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  RubricFeedback,
  mapDispatchToProps,
  mapStateToProps,
} from './RubricFeedback';
import { feedbackRequirement } from 'data/services/lms/constants';

jest.mock('components/InfoPopover', () => 'InfoPopover');

jest.mock('@edx/paragon', () => ({
  Form: {
    Group: () => 'Form.Group',
    Label: () => 'Form.Label',
    Control: () => 'Form.Control',
  },
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      isGrading: jest.fn((...args) => ({ _isGragrding: args })),
      rubric: {
        feedbackConfig: jest.fn((...args) => ({
          _rubricFeedbackConfig: args,
        })),
        feedbackPrompt: jest.fn((...args) => ({
          _rubricFeedbackPrompt: args,
        })),
      },
    },
    grading: {
      selected: {
        overallFeedback: jest.fn((...args) => ({ _overallFeedback: args })),
      },
    },
  },
}));

describe('Review Feedback component', () => {
  const props = {
    config: 'config stirng',
    isGrading: true,
    value: 'some value',
    feedbackPrompt: 'feedback prompt',
    gradeStatus: 'ungraded',
    setValue: jest.fn().mockName('this.props.setValue'),
  };

  let el;
  beforeEach(() => {
    el = shallow(<RubricFeedback {...props} />);
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

    test('is configure to disabled', () => {
      el.setProps({
        config: feedbackRequirement.disabled,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('is grading', () => {
      expect(el.isEmptyRender()).toEqual(false);
      const input = el.find('.rubric-feedback.feedback-input');
      expect(input.prop('disabled')).toEqual(false);
      expect(input.prop('value')).toEqual(props.value);
    });

    test('is graded', () => {
      el.setProps({
        isGrading: false,
        gradeStatus: 'graded',
      });
      expect(el.isEmptyRender()).toEqual(false);
      const input = el.find('.rubric-feedback.feedback-input');
      expect(input.prop('disabled')).toEqual(true);
      expect(input.prop('value')).toEqual(props.value);
    });
    test('is configure to disabled', () => {
      el.setProps({
        config: feedbackRequirement.disabled,
      });
      expect(el.isEmptyRender()).toEqual(true);
    });

    test('set value called on change', () => {
      el = shallow(<RubricFeedback {...props} />);
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
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('selectors.app.isGrading', () => {
      expect(mapped.isGrading).toEqual(selectors.app.isGrading(testState));
    });

    test('selectors.app.rubricFeedbackConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.feedbackConfig(testState),
      );
    });

    test('selectors.grading.selected.overallFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.overallFeedback(testState),
      );
    });

    test('selectors.app.rubric.feedbackPrompt', () => {
      expect(mapped.feedbackPrompt).toEqual(
        selectors.app.rubric.feedbackPrompt(testState),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    test('maps actions.grading.setRubricFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setValue).toEqual(
        actions.grading.setRubricFeedback,
      );
    });
  });
});
