import React from 'react';
import { shallow } from 'enzyme';

import { Collapsible } from '@edx/paragon';

import FilePopoverContent from 'components/FilePopoverContent';
import FileInfo from './FileInfo';
import FileCard from './FileCard';

jest.mock('components/FilePopoverContent', () => 'FilePopoverContent');
jest.mock('./FileInfo', () => 'FileInfo');

describe('File Preview Card component', () => {
  const props = {
    file: {
      name: 'test-file-name.pdf',
      description: 'test-file description',
      downloadUrl: 'destination/test-file-name.pdf',
    },
  };
  const children = (<h1>some children</h1>);
  let el;
  beforeEach(() => {
    el = shallow(<FileCard {...props}>{children}</FileCard>);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
  describe('Component', () => {
    test('collapsible title is name header', () => {
      const title = el.find(Collapsible).prop('title');
      expect(title).toEqual(<h3 className="file-card-title">{props.file.name}</h3>);
    });
    test('forwards children into preview-panel', () => {
      const previewPanelChildren = el.find('.preview-panel').children();
      expect(previewPanelChildren.at(0).equals(
        <FileInfo><FilePopoverContent file={props.file} /></FileInfo>,
      ));
      expect(previewPanelChildren.at(1).equals(children)).toEqual(true);
    });
  });
});
