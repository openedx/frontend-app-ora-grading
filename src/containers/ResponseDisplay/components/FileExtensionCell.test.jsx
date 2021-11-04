import React from 'react';
import { shallow } from 'enzyme';

import FileExtensionCell from './FileExtensionCell';

describe('FileExtensionCell', () => {
  describe('component', () => {
    const props = {
      value: 'file_name.with_extension.pdf',
    };
    let el;
    beforeEach(() => {
      el = shallow(<FileExtensionCell {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        expect(el.text()).toEqual('PDF');
      });
    });
  });
});
