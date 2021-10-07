import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  RubricFeedback,
  mapDispatchToProps,
  mapStateToProps,
} from './RubricFeedback';

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
      rubricFeedbackConfig: jest.fn((...args) => ({
        _rubricFeedbackConfig: args,
      })),
      rubricFeedbackPrompt: jest.fn((...args) => ({
        _rubricFeedbackPrompt: args,
      })),
    },
    grading: {
      selected: {
        overallFeedback: jest.fn((...args) => ({ _overallFeedback: args })),
        gradeStatus: jest.fn((...args) => ({ _gradeStatus: args })),
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
  describe('snapshot', () => {
    test('is grading', () => {
      expect(shallow(<RubricFeedback {...props} />)).toMatchSnapshot();
    });
    test('is graded', () => {
      expect(
        shallow(
          <RubricFeedback {...props} isGrading={false} gradeStatus="graded" />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('is grading', () => {
      const el = shallow(<RubricFeedback {...props} />);
      expect(el.isEmptyRender()).toEqual(false);
      const input = el.find('.rubric-feedback.feedback-input');
      expect(input.prop('disabled')).toEqual(false);
      expect(input.prop('value')).toEqual(props.value);
    });

    test('is graded', () => {
      const el = shallow(
        <RubricFeedback {...props} isGrading={false} gradeStatus="graded" />,
      );
      expect(el.isEmptyRender()).toEqual(false);
      const input = el.find('.rubric-feedback.feedback-input');
      expect(input.prop('disabled')).toEqual(true);
      expect(input.prop('value')).toEqual(props.value);
    });
    test('is ungraded and not grading', () => {
      const el = shallow(<RubricFeedback {...props} isGrading={false} />);
      expect(el.isEmptyRender()).toEqual(true);
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
        selectors.app.rubricFeedbackConfig(testState),
      );
    });

    test('selectors.grading.selected.overallFeedback', () => {
      expect(mapped.value).toEqual(
        selectors.grading.selected.overallFeedback(testState),
      );
    });

    test('selectors.app.rubricFeedbackPrompt', () => {
      expect(mapped.feedbackPrompt).toEqual(
        selectors.app.rubricFeedbackPrompt(testState),
      );
    });

    test('selectors.grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(
        selectors.grading.selected.gradeStatus(testState),
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
