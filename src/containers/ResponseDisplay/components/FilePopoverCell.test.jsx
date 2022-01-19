import React from 'react';
import { shallow } from 'enzyme';

import FilePopoverContent from 'components/FilePopoverContent';
import FilePopoverCell from './FilePopoverCell';

jest.mock('components/InfoPopover', () => 'InfoPopover');
jest.mock('components/FilePopoverContent', () => 'FilePopoverContent');

describe('FilePopoverCell', () => {
  describe('component', () => {
    const props = {
      row: {
        original: {
          name: 'some file name',
          description: 'long descriptive text...',
          downloadURL: 'this-url-is.working',
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
        const content = el.find(FilePopoverContent);
        expect(content.props()).toEqual({ ...original });
      });
    });
  });
});
