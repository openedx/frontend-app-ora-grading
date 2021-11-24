import React from 'react';
import { shallow } from 'enzyme';

import { thunkActions } from 'data/redux';

import {
  ReviewError,
  mapDispatchToProps,
} from './ReviewError';

let el;
jest.useFakeTimers('modern');

describe('ReviewError component', () => {
  const props = {};
  describe('component', () => {
    beforeEach(() => {
      props.reload = jest.fn();
    });
    describe('render tests', () => {
      beforeEach(() => {
        el = shallow(<ReviewError {...props} />);
      });
      test('snapshot', () => {
        expect(el).toMatchSnapshot();
      });
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads reload from thunkActions.grading.reloadSubmission', () => {
      expect(mapDispatchToProps.reload).toEqual(thunkActions.grading.loadSubmission);
    });
  });
});
