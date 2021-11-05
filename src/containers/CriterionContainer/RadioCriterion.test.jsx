import React from 'react';
import { shallow } from 'enzyme';

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
    criterionGradeData: jest.fn((...args) => ({
      selectedCriterionGradeData: args,
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
    setCriterionOption: jest.fn().mockName('this.props.setCriterionOption'),
  };

  let el;
  beforeEach(() => {
    el = shallow(<RadioCriterion {...props} />);
    el.instance().onChange = jest.fn().mockName('this.onChange');
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el.instance().render()).toMatchSnapshot();
    });

    test('is not grading', () => {
      el.setProps({
        isGrading: false,
      });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('rendering', () => {
      test('is grading (all options are not disabled)', () => {
        expect(el.isEmptyRender()).toEqual(false);
        const optionsEl = el.find('.criteria-option');
        expect(optionsEl.length).toEqual(props.config.options.length);
        optionsEl.forEach((optionEl) => expect(optionEl.prop('disabled')).toEqual(false));
      });

      test('is not grading (all options are disabled)', () => {
        el.setProps({
          isGrading: false,
        });
        expect(el.isEmptyRender()).toEqual(false);
        const optionsEl = el.find('.criteria-option');
        expect(optionsEl.length).toEqual(props.config.options.length);
        optionsEl.forEach((optionEl) => expect(optionEl.prop('disabled')).toEqual(true));
      });
    });

    describe('behavior', () => {
      test('onChange call set crition option', () => {
        el = shallow(<RadioCriterion {...props} />);
        el.instance().onChange({
          target: {
            value: 'some value',
          },
        });
        expect(props.setCriterionOption).toBeCalledTimes(1);
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

  describe('mapDispatchToProps', () => {
    test('maps actions.grading.setCriterionFeedback to setValue prop', () => {
      expect(mapDispatchToProps.setCriterionOption).toEqual(
        actions.grading.setCriterionOption,
      );
    });
  });
});
