import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

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
      expect(el.snapshot).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        expect(el.instance.children[0].el).toEqual(props.value);
      });
    });
  });
});
