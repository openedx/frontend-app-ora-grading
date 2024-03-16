import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { actions, selectors } from 'data/redux';
import { formatMessage } from 'testUtils';
import {
  RadioCriterion,
  mapDispatchToProps,
  mapStateToProps,
} from './RadioCriterion';

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
    intl: { formatMessage },
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
    data: 'selected radio option',
    setCriterionOption: jest.fn().mockName('this.props.setCriterionOption'),
    isInvalid: false,
  };

  let el;
  beforeEach(() => {
    el = shallow(<RadioCriterion {...props} />);
    el.instance.onChange = jest.fn().mockName('this.onChange');
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el.snapshot).toMatchSnapshot();
    });

    test('is not grading', () => {
      el = shallow(<RadioCriterion {...props} isGrading={false} />);
      expect(el.snapshot).toMatchSnapshot();
    });

    test('radio contain invalid response', () => {
      el = shallow(<RadioCriterion {...props} isInvalid />);
      expect(el.snapshot).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('rendering', () => {
      test('is grading (all options are not disabled)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        const optionsEl = el.instance.children;
        expect(optionsEl.length).toEqual(props.config.options.length);
        optionsEl.forEach((optionEl) => expect(optionEl.props.disabled).toEqual(false));
      });

      test('is not grading (all options are disabled)', () => {
        el = shallow(<RadioCriterion {...props} isGrading={false} />);
        expect(el.isEmptyRender()).toEqual(false);
        const optionsEl = el.instance.children;
        expect(optionsEl.length).toEqual(props.config.options.length);
        optionsEl.forEach((optionEl) => expect(optionEl.props.disabled).toEqual(true));
      });

      test('radio contain invalid response (error response get render)', () => {
        el = shallow(<RadioCriterion {...props} isInvalid />);
        expect(el.isEmptyRender()).toEqual(false);
        const radioErrorEl = el.instance.children[2];
        expect(radioErrorEl.props.type).toBe('invalid');
        expect(radioErrorEl.props.className).toBe('feedback-error-msg');
        expect(radioErrorEl).toBeTruthy();
      });
    });

    describe('behavior', () => {
      test('onChange call set crition option', () => {
        el = shallow(<RadioCriterion {...props} />);
        el.instance.children[0].props.onChange({
          target: {
            value: 'some value',
          },
        });
        expect(props.setCriterionOption).toBeCalledTimes(1);
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

    test('selectors.grading.selected.criterionSelectedOption', () => {
      expect(mapped.data).toEqual(
        selectors.grading.selected.criterionSelectedOption(testState, ownProps),
      );
    });
    test('selectors.grading.validation.criterionSelectedOptionIsInvalid', () => {
      expect(mapped.isInvalid).toEqual(
        selectors.grading.validation.criterionSelectedOptionIsInvalid(testState, ownProps),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    test('maps actions.grading.setCriterionFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setCriterionOption).toEqual(
        actions.grading.setCriterionOption,
      );
    });
  });
});
