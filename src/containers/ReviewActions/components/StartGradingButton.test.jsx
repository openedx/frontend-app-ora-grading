import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

import {
  StartGradingButton,
  mapStateToProps,
  mapDispatchToProps,
} from './StartGradingButton';

jest.mock('@edx/paragon', () => ({
  Button: () => 'Button',
}));
jest.mock('@edx/paragon/icons', () => ({
  Cancel: 'Cancel',
  Highlight: 'Highlight',
}));
jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grading: {
      selected: {
        gradingStatus: (state) => ({ gradingStatus: state }),
      },
    },
  },
}));

describe('StartGradingButton component', () => {
  describe('component', () => {
    const props = {};
    beforeEach(() => {
      props.startGrading = jest.fn().mockName('this.props.startGrading');
      props.stopGrading = jest.fn().mockName('this.props.stopGrading');
    });
    const render = (gradingStatus) => shallow(
      <StartGradingButton {...props} gradingStatus={gradingStatus} />,
    );
    test('snapshot: locked (null)', () => {
      const el = render(statuses.locked);
      expect(el).toMatchSnapshot();
      expect(el).toEqual({});
    });
    test('snapshot: ungraded (startGrading callback)', () => {
      expect(render(statuses.ungraded)).toMatchSnapshot();
    });
    test('snapshot: graded (startGrading callback', () => {
      expect(render(statuses.graded)).toMatchSnapshot();
    });
    test('snapshot: inProgress (stopGrading callback', () => {
      expect(render(statuses.inProgress)).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('gradingStatus loads from grading.selected.gradingStatus', () => {
      expect(mapped.gradingStatus).toEqual(selectors.grading.selected.gradingStatus(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads startGrading from thunkActions.grading.stargGrading', () => {
      expect(mapDispatchToProps.startGrading).toEqual(thunkActions.grading.startGrading);
    });
    it('loads stopGrading from thunkActions.grading.stopGrading', () => {
      expect(mapDispatchToProps.stopGrading).toEqual(thunkActions.grading.stopGrading);
    });
  });
});
