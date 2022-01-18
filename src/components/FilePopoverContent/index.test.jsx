import React from 'react';
import { shallow } from 'enzyme';

import filesize from 'filesize';
import FilePopoverContent from '.';

jest.mock('filesize', () => (size) => `filesize(${size})`);

describe('FilePopoverContent', () => {
  describe('component', () => {
    const props = {
      file: {
        name: 'some file name',
        description: 'long descriptive text...',
        downloadURL: 'this-url-is.working',
        size: 6000,
      },
    };
    let el;
    beforeEach(() => {
      el = shallow(<FilePopoverContent {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        expect(el.text()).toContain(props.file.name);
        expect(el.text()).toContain(props.file.description);
        expect(el.text()).toContain(filesize(props.file.size));
      });
    });
  });
});
