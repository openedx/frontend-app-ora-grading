import React from 'react';
import { shallow } from 'enzyme';

import { selectors, thunkActions } from 'data/redux';
import { Rubric, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('containers/CriterionContainer', () => 'CriterionContainer');
jest.mock('./RubricFeedback', () => 'RubricFeedback');

jest.mock('data/redux/app/selectors', () => ({
  isGrading: jest.fn((...args) => ({ isGragrding: args })),
  rubric: {
    criteriaIndices: jest.fn((...args) => ({
      rubricCriteriaIndices: args,
    })),
  },
}));

describe('Rubric Container', () => {
  const props = {
    isGrading: true,
    criteriaIndices: [1, 2, 3, 4, 5],
    submitGrade: jest.fn().mockName('this.props.submitGrade'),
  };
  let el;
  beforeEach(() => {
    el = shallow(<Rubric {...props} />);
    el.instance().submitGradeHandler = jest
      .fn()
      .mockName('this.submitGradeHandler');
  });
  describe('snapshot', () => {
    test('is grading', () => {
      expect(el).toMatchSnapshot();
    });
    test('is not grading', () => {
      el.setProps({
        isGrading: false,
      });
      expect(el).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('render', () => {
      test('is grading (grading footer present)', () => {
        expect(el.find('.grading-rubric-footer').length).toEqual(1);
        const containers = el.find('CriterionContainer');
        expect(containers.length).toEqual(props.criteriaIndices.length);
        containers.forEach((container, i) => {
          expect(container.key()).toEqual(String(props.criteriaIndices[i]));
        });
      });

      test('is not grading (no grading footer)', () => {
        el.setProps({
          isGrading: false,
        });
        expect(el.find('.grading-rubric-footer').length).toEqual(0);
        const containers = el.find('CriterionContainer');
        expect(containers.length).toEqual(props.criteriaIndices.length);
        containers.forEach((container, i) => {
          expect(container.key()).toEqual(String(props.criteriaIndices[i]));
        });
      });
    });

    describe('behavior', () => {
      test('submitGrade', () => {
        el = shallow(<Rubric {...props} />);
        el.instance().submitGradeHandler();
        expect(props.submitGrade).toBeCalledTimes(1);
      });
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

  describe('mapDispatchToProps', () => {
    beforeEach(() => {});

    test('maps thunkActions.grading.submitGrade to submitGrade prop', () => {
      expect(mapDispatchToProps.submitGrade).toEqual(
        thunkActions.grading.submitGrade,
      );
    });
  });
});
