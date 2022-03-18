import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import CriterionContainer from 'containers/CriterionContainer';
import { Rubric, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('containers/CriterionContainer', () => 'CriterionContainer');
jest.mock('./RubricFeedback', () => 'RubricFeedback');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      rubric: {
        criteriaIndices: jest.fn((...args) => ({
          rubricCriteriaIndices: args,
        })),
      },
    },
    grading: {
      selected: {
        isGrading: jest.fn((...args) => ({ isGrading: args })),
      },
    },
    requests: {
      isCompleted: jest.fn((...args) => ({ isCompleted: args })),
      isPending: jest.fn((...args) => ({ isPending: args })),
    },
  },
  thunkActions: {
    grading: {
      submitGrade: jest.fn(),
    },
  },
}));

describe('Rubric Container', () => {
  const props = {
    intl: { formatMessage },
    isCompleted: false,
    gradeIsPending: false,
    lockIsPending: false,
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
    beforeEach(() => {
      el.instance().submitGradeHandler = jest.fn().mockName('this.submitGradeHandler');
      el.instance().hideDemoAlert = jest.fn().mockName('this.hideDemoAlert');
      jest.spyOn(el.instance(), 'criteria', 'get').mockReturnValue('// get this.criteria()');
    });
    test('is grading', () => {
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('is not grading', () => {
      el.setProps({ isGrading: false });
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('is grading, submit pending', () => {
      el.setProps({ gradeIsPending: true });
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('is grading, lock is pending', () => {
      el.setProps({ lockIsPending: true });
      expect(el.instance().render()).toMatchSnapshot();
    });
    test('submit completed', () => {
      el.setProps({ isCompleted: true, isGrading: false });
      expect(el.instance().render()).toMatchSnapshot();
    });
  });

  describe('component', () => {
    describe('render', () => {
      test('criteria getter returns a CriterionContainer for each criteriaIndices value', () => {
        const container = (value) => (
          shallow(<CriterionContainer isGrading key={value} orderNum={value} />)
        );
        expect(el.instance().criteria).toMatchObject(props.criteriaIndices.map(container));
      });
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
    test('isGrading from selectors.grading.selected.isGrading', () => {
      expect(mapped.isGrading).toEqual(selectors.grading.selected.isGrading(testState));
    });
    test('gradeIsPending from selectors.requests.isPending(submitGrade)', () => {
      expect(mapped.gradeIsPending).toEqual(
        selectors.requests.isPending(testState, { requestKey: RequestKeys.submitGrade }),
      );
    });
    test('lockIsPending from selectors.requests.isPending(setLock)', () => {
      expect(mapped.lockIsPending).toEqual(selectors.requests.isPending(
        testState, { requestKey: RequestKeys.setLock },
      ));
    });
    test('criteriaIndices from selectors.app.rubric.criteriaIndices', () => {
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
