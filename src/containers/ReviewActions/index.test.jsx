import React from 'react';
import { shallow } from 'enzyme';

import actions from 'data/actions';
import selectors from 'data/selectors';

import { ReviewActions, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('@edx/paragon', () => ({
  ActionRow: () => 'ActionRow',
  Button: () => 'Button',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    app: { showRubric: (state) => ({ showRubric: state }) },
    grading: {
      selected: {
        username: (state) => ({ username: state }),
        gradingStatus: (state) => ({ gradingStatus: state }),
      },
    },
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
    };
    beforeEach(() => {
      props.toggleShowRubric = jest.fn().mockName('this.props.toggleShowRubric');
    });
    test('snapshot: do not show rubric', () => {
      expect(shallow(<ReviewActions {...props} />)).toMatchSnapshot();
    });
    test('snapshot: show rubric', () => {
      expect(shallow(<ReviewActions {...props} showRubric />)).toMatchSnapshot();
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
