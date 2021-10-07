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
      rubric: {
        criterionConfig: jest.fn(({ config }) => ({ ...config })),
      }
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
  };
  let el;
  beforeEach(() => {
    el = shallow(<CriterionContainer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('component', () => {
    test('rendering', () => {
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
    test('selectors.app.rubric.criterionConfig', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, additionalArgs),
      );
    });
  });
});
