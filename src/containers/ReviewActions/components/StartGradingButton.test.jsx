import React from 'react';
import { shallow } from 'enzyme';

import { selectors, thunkActions } from 'data/redux';
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
jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    gradeStatus: (state) => ({ gradeStatus: state }),
    gradingStatus: (state) => ({ gradingStatus: state }),
  },
}));
jest.mock('./OverrideGradeConfirmModal', () => 'OverrideGradeConfirmModal');
jest.mock('./StopGradingConfirmModal', () => 'StopGradingConfirmModal');

let el;

describe('StartGradingButton component', () => {
  describe('component', () => {
    const props = {};
    beforeEach(() => {
      props.startGrading = jest.fn().mockName('this.props.startGrading');
      props.stopGrading = jest.fn().mockName('this.props.stopGrading');
    });
    describe('snapshotes', () => {
      const mockedEl = (gradingStatus, gradeStatus) => {
        const renderedEl = shallow(
          <StartGradingButton
            {...props}
            gradingStatus={gradingStatus}
            gradeStatus={gradeStatus || gradingStatus}
          />,
        );
        const mockMethod = (methodName) => {
          renderedEl.instance()[methodName] = jest.fn().mockName(`this.${methodName}`);
        };
        mockMethod('handleClick');
        mockMethod('hideConfirmOverrideGrade');
        mockMethod('confirmOverrideGrade');
        mockMethod('hideConfirmStopGrading');
        mockMethod('confirmStopGrading');
        return renderedEl;
      };
      test('snapshot: locked (null)', () => {
        el = mockedEl(statuses.locked);
        expect(el.instance().render()).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(true);
      });
      test('snapshot: ungraded (startGrading callback)', () => {
        expect(mockedEl(statuses.ungraded).instance().render()).toMatchSnapshot();
      });
      test('snapshot: graded, confirmOverride (startGrading callback)', () => {
        el = mockedEl(statuses.graded);
        el.setState({ showConfirmOverrideGrade: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: inProgress, isOverride, confirmStop (stopGrading callback)', () => {
        el = mockedEl(statuses.inProgress, statuses.graded);
        el.setState({ showConfirmStopGrading: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('gradeStatus loads from grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(selectors.grading.selected.gradeStatus(testState));
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
