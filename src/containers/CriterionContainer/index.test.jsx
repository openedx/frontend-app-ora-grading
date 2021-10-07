import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';
import { CriterionContainer, mapDispatchToProps, mapStateToProps } from '.';

jest.mock('./RadioCriterion', () => 'RadioCriterion');
jest.mock('./CriterionFeedback', () => 'CriterionFeedback');
jest.mock('components/InfoPopover', () => 'InfoPopover');

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
      rubricCriterionConfig: jest.fn(({ config }) => ({ ...config })),
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
    setFeedback: jest.fn().mockName('this.props.setFeedback'),
  };
  test('snapshot', () => {
    expect(shallow(<CriterionContainer {...props} />)).toMatchSnapshot();
  });

  describe('component', () => {
    test('rendering', () => {
      const el = shallow(<CriterionContainer {...props} />);
      expect(el.isEmptyRender()).toEqual(false);
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
    test('selectors.app.rubricCriterionConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubricCriterionConfig(testState, additionalArgs),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    test('actions.grading.setCriterionFeedback', () => {
      expect(mapDispatchToProps.setFeedback).toEqual(
        actions.grading.setCriterionFeedback,
      );
    });
  });
});
