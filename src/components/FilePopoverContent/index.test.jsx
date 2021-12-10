import React from 'react';
import { shallow } from 'enzyme';

import FilePopoverContent from '.';

describe('FilePopoverContent', () => {
  describe('component', () => {
    const props = {
      file: {
        name: 'some file name',
        description: 'long descriptive text...',
        downloadURL: 'this-url-is.working',
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
      });
    });
  });
});
