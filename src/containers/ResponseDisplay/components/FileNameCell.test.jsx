import React from 'react';
import { shallow } from 'enzyme';

import FileNameCell from './FileNameCell';

describe('FileNameCell', () => {
  describe('component', () => {
    const props = {
      value: 'some test text value',
    };
    let el;
    beforeEach(() => {
      el = shallow(<FileNameCell {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        expect(el.text()).toEqual(props.value);
      });
    });
  });
});
