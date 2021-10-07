import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import {
  RadioCriterion,
  mapDispatchToProps,
  mapStateToProps,
} from './RadioCriterion';

jest.mock('@edx/paragon', () => ({
  Form: {
    RadioSet: () => 'Form.RadioSet',
    Radio: () => 'Form.Radio',
  },
}));

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      rubricCriterionConfig: jest.fn((...args) => ({
        _rubricCriterionConfig: args,
      })),
    },
    grading: {
      selected: {
        criterionGradeData: jest.fn((...args) => ({ _data: args })),
      },
    },
  },
}));

describe('Radio Crition Container', () => {
  const props = {
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
  describe('snapshot', () => {
    test('is grading', () => {
      expect(shallow(<RadioCriterion {...props} />)).toMatchSnapshot();
    });

    test('is not grading', () => {
      expect(
        shallow(<RadioCriterion {...props} isGrading={false} />),
      ).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('is grading', () => {
      const el = shallow(<RadioCriterion {...props} />);
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.find('.criteria-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl) =>
        expect(optionEl.prop('disabled')).toEqual(false),
      );
    });

    test('is not grading', () => {
      const el = shallow(<RadioCriterion {...props} />);
      expect(el.isEmptyRender()).toEqual(false);
      const optionsEl = el.find('.criteria-option');
      expect(optionsEl.length).toEqual(props.config.options.length);
      optionsEl.forEach((optionEl) =>
        expect(optionEl.prop('disabled')).toEqual(false),
      );
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitary: 'some data' };
    const additionalArgs = { orderNum: props.orderNum };
    let mapped;
    beforeEach(() => {
      mapped = mapStateToProps(testState, additionalArgs);
    });
    test('selectors.app.rubricCriterionConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubricCriterionConfig(testState, additionalArgs),
      );
    });

    test('selectors.grading.selected.criterionGradeData', () => {
      expect(mapped.data).toEqual(
        selectors.grading.selected.criterionGradeData(
          testState,
          additionalArgs,
        ),
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
