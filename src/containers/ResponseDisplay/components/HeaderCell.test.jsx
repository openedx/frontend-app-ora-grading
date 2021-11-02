import React from 'react';
import { shallow } from 'enzyme';

import {
  HeaderEllipsesCell,
  HeaderFileExtensionCell,
  HeaderInfoPopoverCell,
} from './HeaderCell';

jest.mock('components/InfoPopover', () => 'InfoPopover');

describe('HeaderEllipsesCell', () => {
  describe('component', () => {
    const props = {
      value: 'some test text value',
    };
    let el;
    beforeEach(() => {
      el = shallow(<HeaderEllipsesCell {...props} />);
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

describe('HeaderFileExtensionCell', () => {
  describe('component', () => {
    const props = {
      value: 'file_name.with_extension.pdf',
    };
    let el;
    beforeEach(() => {
      el = shallow(<HeaderFileExtensionCell {...props} />);
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

describe('HeaderInfoPopoverCell', () => {
  describe('component', () => {
    const props = {
      row: {
        original: {
          key: 'value',
          key2: 'value2',
        },
      },
    };
    let el;
    beforeEach(() => {
      el = shallow(<HeaderInfoPopoverCell {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });

    describe('behavior', () => {
      test('content', () => {
        const { original } = props.row;
        Object.keys(original).forEach(key => {
          expect(el.text()).toContain(key.toUpperCase());
          expect(el.text()).toContain(original[key]);
        });
      });
    });
  });
});
