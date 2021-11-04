import React from 'react';
import { shallow } from 'enzyme';

import FilePopoverCell from './FilePopoverCell';

jest.mock('components/InfoPopover', () => 'InfoPopover');

describe('FilePopoverCell', () => {
  describe('component', () => {
    const props = {
      row: {
        original: {
          name: 'some file name',
          description: 'long descriptive text...',
          downloadUrl: 'this-url-is.working',
        },
      },
    };
    let el;
    beforeEach(() => {
      el = shallow(<FilePopoverCell {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        const { original } = props.row;
        expect(el.text()).toContain(original.name);
        expect(el.text()).toContain(original.description);
      });
    });
  });
});
