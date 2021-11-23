import React from 'react';
import { shallow } from 'enzyme';

import { actions, selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import { ReviewActions, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('data/redux/app/selectors', () => ({
  showRubric: (state) => ({ showRubric: state }),
}));
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    gradingStatus: (state) => ({ gradingStatus: state }),
    points: (state) => ({ points: state }),
    username: (state) => ({ username: state }),
  },
}));
jest.mock('data/redux/requests/selectors', () => ({
  isCompleted: (state) => ({ isCompleted: state }),
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
      points: { pointsEarned: 3, pointsPossible: 10 },
    };
    beforeEach(() => {
      props.toggleShowRubric = jest.fn().mockName('this.props.toggleShowRubric');
    });
    test('snapshot: loading', () => {
      expect(shallow(<ReviewActions {...props} />)).toMatchSnapshot();
    });
    test('snapshot: do not show rubric', () => {
      expect(shallow(<ReviewActions {...props} isLoaded />)).toMatchSnapshot();
    });
    test('snapshot: show rubric, no points', () => {
      expect(shallow(<ReviewActions {...props} isLoaded showRubric points={{}} />)).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('isLoaded loads from requests.isCompleted for fetchSubmissions', () => {
      const requestKey = RequestKeys.fetchSubmission;
      expect(mapped.isLoaded).toEqual(selectors.requests.isCompleted(testState, { requestKey }));
    });
    test('username loads from grading.selected.username', () => {
      expect(mapped.username).toEqual(selectors.grading.selected.username(testState));
    });
    test('gradingStatus loads from grading.selected.gradingStatus', () => {
      expect(mapped.gradingStatus).toEqual(selectors.grading.selected.gradingStatus(testState));
    });
    test('points loads from grading.selected.points', () => {
      expect(mapped.points).toEqual(selectors.grading.selected.points(testState));
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
