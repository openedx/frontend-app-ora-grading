import React from 'react';
import { shallow } from 'enzyme';

import filesize from 'filesize';
import FilePopoverContent from '.';

jest.mock('filesize', () => (size) => `filesize(${size})`);

describe('FilePopoverContent', () => {
  describe('component', () => {
    const props = {
      name: 'some file name',
      description: 'long descriptive text...',
      downloadURL: 'this-url-is.working',
      size: 6000,
    };
    let el;
    beforeEach(() => {
      el = shallow(<FilePopoverContent {...props} />);
    });
    describe('snapshot', () => {
      test('default', () => expect(el).toMatchSnapshot());
      test('invalid size', () => {
        el.setProps({
          size: null,
        });
        expect(el).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      test('content', () => {
        expect(el.text()).toContain(props.name);
        expect(el.text()).toContain(props.description);
        expect(el.text()).toContain(filesize(props.size));
      });
    });
  });
});
