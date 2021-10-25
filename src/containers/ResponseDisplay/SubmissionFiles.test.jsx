import React from 'react';
import { shallow } from 'enzyme';

import { SubmissionFiles } from './SubmissionFiles';

jest.mock('@edx/paragon', () => {
  const Card = () => 'Card';
  const Collapsible = () => 'Collapsible';
  Collapsible.Advanced = 'Collapsible.Advanced';
  Collapsible.Trigger = 'Collapsible.Trigger';
  Collapsible.Visible = 'Collapsible.Visible';
  Collapsible.Body = 'Collapsible.Body';

  const Button = () => 'Button';
  const Icon = () => 'Icon';
  const DataTable = () => 'DataTable';
  DataTable.Table = 'DataTable.Table';
  const IconButton = () => 'IconButton';

  return {
    Card,
    Collapsible,
    Button,
    Icon,
    DataTable,
    IconButton,
  }
});

jest.mock('@edx/paragon/icons', () => ({
  Download: () => 'Download', ArrowDropDown: () => 'ArrowDropDown', ArrowDropUp: () => 'ArrowDropUp'
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
      ]
    };
    test('snapshot: files exited for props', () => {
      expect(shallow(<SubmissionFiles {...props} />)).toMatchSnapshot();
    });
    test('snapshot: files does not exist', () => {
      expect(shallow(<SubmissionFiles />)).toMatchSnapshot();
    });
  });
});
