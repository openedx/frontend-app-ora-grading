import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Collapsible } from '@openedx/paragon';

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
    expect(el.snapshot).toMatchSnapshot();
  });
  describe('Component', () => {
    test('collapsible title is name header', () => {
      const { title } = el.instance.findByType(Collapsible)[0].props;
      expect(title).toEqual(<h3 className="file-card-title">{props.file.name}</h3>);
    });
    test('forwards children into preview-panel', () => {
      const previewPanelChildren = el.instance.findByTestId('preview-panel')[0].children;
      expect(previewPanelChildren[0].matches(
        <FileInfo><FilePopoverContent file={props.file} /></FileInfo>,
      ));
      expect(previewPanelChildren[1].matches(shallow(children))).toEqual(true);
    });
  });
});
