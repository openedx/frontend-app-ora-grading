import React from 'react';
import { shallow } from 'enzyme';

import { selectors, thunkActions } from 'data/redux';

import { formatMessage } from 'testUtils';
import {
  ListError,
  mapDispatchToProps,
  mapStateToProps,
} from './ListError';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: (...args) => ({ courseId: args }),
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
    },
  },
}));

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `api/openResponse/${courseId}`,
}));

let el;
jest.useFakeTimers('modern');

describe('ListError component', () => {
  describe('component', () => {
    const props = {
      courseId: 'test-course-id',
    };
    beforeEach(() => {
      props.loadSelectionForReview = jest.fn();
      props.intl = { formatMessage };
      props.initializeApp = jest.fn();
    });
    describe('render tests', () => {
      beforeEach(() => {
        el = shallow(<ListError {...props} />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('courseId loads from app.courseId', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads initializeApp from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(thunkActions.app.initialize);
    });
  });
});
