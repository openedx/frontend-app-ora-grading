import React from 'react';
import { shallow } from 'enzyme';

import { selectors, thunkActions } from 'data/redux';

import { formatMessage } from 'testUtils';

import {
  SubmissionNavigation,
  mapStateToProps,
  mapDispatchToProps,
} from './SubmissionNavigation';

jest.mock('data/redux/grading/selectors', () => ({
  prev: {
    doesExist: (state) => ({ prevDoesExist: state }),
  },
  next: {
    doesExist: (state) => ({ nextDoesExist: state }),
  },
  activeIndex: (state) => ({ activeIndex: state }),
  selectionLength: (state) => ({ selectionLength: state }),
}));
jest.mock('data/redux/requests/selectors', () => ({
  allowNavigation: (state) => ({ allowNavigation: state }),
}));

describe('SubmissionNavigation component', () => {
  describe('component', () => {
    const props = {
      intl: { formatMessage },
      activeIndex: 4,
      selectionLength: 5,
    };
    beforeEach(() => {
      props.loadNext = jest.fn().mockName('this.props.loadNext');
      props.loadPrev = jest.fn().mockName('this.props.loadPrev');
    });
    test('snapshot: no prev submission (disabled)', () => {
      expect(shallow(
        <SubmissionNavigation {...props} activeIndex={0} hasNextSubmission />,
      )).toMatchSnapshot();
    });
    test('snapshot: no next submission (disabled)', () => {
      expect(shallow(
        <SubmissionNavigation {...props} hasPrevSubmission />,
      )).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('activeIndex loads from grading.activeIndex', () => {
      expect(mapped.activeIndex).toEqual(selectors.grading.activeIndex(testState));
    });
    test('hasNextSubmission loads from grading.next.doesExist', () => {
      expect(mapped.hasNextSubmission).toEqual(selectors.grading.next.doesExist(testState));
    });
    test('hasPrevSubmission loads from grading.prev.doesExist', () => {
      expect(mapped.hasPrevSubmission).toEqual(selectors.grading.prev.doesExist(testState));
    });
    test('selectionLength loads from grading.selectionLength', () => {
      expect(mapped.selectionLength).toEqual(selectors.grading.selectionLength(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads loadNext from thunkActions.grading.loadNext', () => {
      expect(mapDispatchToProps.loadNext).toEqual(thunkActions.grading.loadNext);
    });
    it('loads loadPrev from thunkActions.grading.loadPrev', () => {
      expect(mapDispatchToProps.loadPrev).toEqual(thunkActions.grading.loadPrev);
    });
  });
});
