import React from 'react';
import { shallow } from 'enzyme';

import { SubmissionFiles, HeaderEllipsesCell } from './SubmissionFiles';

// jest.mock('@edx/paragon', () => {
//   const Card = () => 'Card';
//   const Collapsible = {};
//   Collapsible.Advanced = 'Collapsible.Advanced';
//   Collapsible.Trigger = 'Collapsible.Trigger';
//   Collapsible.Visible = 'Collapsible.Visible';
//   Collapsible.Body = 'Collapsible.Body';

//   const Button = () => 'Button';
//   const Icon = () => 'Icon';
//   const DataTable = () => 'DataTable';
//   DataTable.Table = 'DataTable.Table';

//   return {
//     Card,
//     Collapsible,
//     Button,
//     Icon,
//     DataTable,
//   };
// });

jest.mock('@edx/paragon', () => {
  const { mockComponents } = jest.requireActual('testUtils');
  return mockComponents(
    'Card',
    'Collapsible.Advanced',
    'Collapsible.Trigger',
    'Collapsible.Visible',
    'Collapsible.Body',
    'Button',
    'Icon',
    'DataTable',
    'DataTable.Table',
  );
});

jest.mock('@edx/paragon/icons', () => ({
  ArrowDropDown: () => 'ArrowDropDown',
  ArrowDropUp: () => 'ArrowDropUp',
}));

describe('SubmissionFiles', () => {
  describe('component', () => {
    const props = {
      files: [
        {
          name: 'some file name.jpg',
          description: 'description for the file',
          downloadUrl: '/valid-url-wink-wink',
        },
        {
          name: 'file number 2.jpg',
          description: 'description for this file',
          downloadUrl: '/url-2',
        },
      ],
    };
    let el;
    beforeAll(() => {
      el = shallow(<SubmissionFiles />);
    });

    describe('snapshot', () => {
      test('files does not exist', () => {
        expect(el).toMatchSnapshot();
      });
      test('files exited for props', () => {
        el.setProps({ ...props });
        expect(el).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      test('title', () => {
        const titleEl = el.find('.submission-files-title>h3');
        expect(titleEl.text()).toEqual(
          `Submission Files (${props.files.length})`,
        );
      });
    });
  });
});

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
