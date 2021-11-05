import React from 'react';
import { shallow } from 'enzyme';

import { actions, selectors } from 'data/redux';

import { ReviewActions, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('data/redux/app/selectors', () => ({
  showRubric: (state) => ({ showRubric: state }),
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    gradingStatus: (state) => ({ gradingStatus: state }),
    score: (state) => ({ score: state }),
    username: (state) => ({ username: state }),
  },
}));
jest.mock('components/StatusBadge', () => 'StatusBadge');
jest.mock('./components/StartGradingButton', () => 'StartGradingButton');
jest.mock('./components/SubmissionNavigation', () => 'SubmissionNavigation');

describe('ReviewActions component', () => {
  describe('component', () => {
    const props = {
      gradingStatus: 'grading-status',
      username: 'test-username',
      showRubric: false,
      score: { pointsEarned: 3, pointsPossible: 10 },
    };
    beforeEach(() => {
      props.toggleShowRubric = jest.fn().mockName('this.props.toggleShowRubric');
    });
    test('snapshot: do not show rubric', () => {
      expect(shallow(<ReviewActions {...props} />)).toMatchSnapshot();
    });
    test('snapshot: show rubric, no score', () => {
      expect(shallow(<ReviewActions {...props} showRubric score={{}} />)).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('username loads from grading.selected.username', () => {
      expect(mapped.username).toEqual(selectors.grading.selected.username(testState));
    });
    test('gradingStatus loads from grading.selected.gradingStatus', () => {
      expect(mapped.gradingStatus).toEqual(selectors.grading.selected.gradingStatus(testState));
    });
    test('score loads from grading.selected.score', () => {
      expect(mapped.score).toEqual(selectors.grading.selected.score(testState));
    });
    test('showRubric loads from app.showRubric', () => {
      expect(mapped.showRubric).toEqual(selectors.app.showRubric(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads toggleShowRubric from actions.app.toggleShowRubric', () => {
      expect(mapDispatchToProps.toggleShowRubric).toEqual(actions.app.toggleShowRubric);
    });
  });
});
