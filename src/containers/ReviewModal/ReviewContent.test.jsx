import React from 'react';
import { shallow } from 'enzyme';

import { selectors } from 'data/redux';
import {
  ReviewContent,
  mapStateToProps,
} from './ReviewContent';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      showRubric: (...args) => ({ showRubric: args }),
    },
  },
}));
jest.mock('containers/ResponseDisplay', () => 'ResponseDisplay');
jest.mock('containers/Rubric', () => 'Rubric');

jest.useFakeTimers('modern');

describe('ReviewContent component', () => {
  describe('component', () => {
    describe('render tests', () => {
      test('snapshot (show rubric)', () => {
        expect(shallow(<ReviewContent />)).toMatchSnapshot();
      });
      test('snapshot (hide rubric)', () => {
        expect(shallow(<ReviewContent showRubric />)).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('showRubric loads from app.showRubric', () => {
      expect(mapped.showRubric).toEqual(selectors.app.showRubric(testState));
    });
  });
});
