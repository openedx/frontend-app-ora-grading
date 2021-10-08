import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import { Rubric, mapStateToProps } from '.';

jest.mock('containers/CriterionContainer', () => 'CriterionContainer');
jest.mock('./RubricFeedback', () => 'RubricFeedback');

jest.mock('@edx/paragon', () => {
  const Card = () => 'Card';
  Card.Body = () => 'Card.Body';
  const Button = () => 'Button';
  return { Button, Card };
});

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: {
      isGrading: jest.fn((...args) => ({ isGragrding: args })),
      rubric: {
        criteriaIndices: jest.fn((...args) => ({
          rubricCriteriaIndices: args,
        })),
      },
    },
  },
}));

describe('Rubric Container', () => {
  const props = {
    isGrading: true,
    criteriaIndices: [1, 2, 3, 4, 5],
  };
  describe('snapshot', () => {
    test('is grading', () => {
      expect(shallow(<Rubric {...props} />)).toMatchSnapshot();
    });
    test('is not grading', () => {
      expect(
        shallow(<Rubric {...props} isGrading={false} />),
      ).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('is grading (grading footer present)', () => {
      const el = shallow(<Rubric {...props} />);
      expect(el.find('.grading-rubric-footer').length).toEqual(1);
    });

    test('is not grading (no grading footer)', () => {
      const el = shallow(<Rubric {...props} isGrading={false} />);
      expect(el.find('.grading-rubric-footer').length).toEqual(0);
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

    test('selectors.app.rubric.criteriaIndices', () => {
      expect(mapped.criteriaIndices).toEqual(
        selectors.app.rubric.criteriaIndices(testState),
      );
    });
  });
});
