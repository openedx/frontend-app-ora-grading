import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

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
      test('default', () => expect(el.snapshot).toMatchSnapshot());
      test('invalid size', () => {
        el = shallow(<FilePopoverContent {...props} size={null} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      test('content', () => {
        const childElements = el.instance.children;
        expect(childElements[0].children[2].el).toContain(props.name);
        expect(childElements[1].children[2].el).toContain(props.description);
        expect(childElements[2].children[2].el).toContain(filesize(props.size));
      });
    });
  });
});
