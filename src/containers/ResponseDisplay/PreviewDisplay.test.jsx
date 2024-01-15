import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { FileTypes } from 'data/constants/files';
import { FileRenderer } from 'components/FilePreview';
import { PreviewDisplay } from './PreviewDisplay';

jest.mock('components/FilePreview', () => ({
  FileRenderer: () => 'FileRenderer',
}));

describe('PreviewDisplay', () => {
  describe('component', () => {
    const supportedTypes = Object.values(FileTypes);
    const props = {
      files: [
        ...supportedTypes.map((fileType, index) => ({
          name: `fake_file_${index}.${fileType}`,
          description: `file description ${index}`,
          downloadUrl: `/url-path/fake_file_${index}.${fileType}`,
        })),
        {
          name: 'bad_ext_fake_file.other',
          description: 'bad_ext file description',
          downloadUrl: 'bad_ext.other',
        },
      ],
    };
    let el;
    beforeEach(() => {
      el = shallow(<PreviewDisplay {...props} />);
    });

    describe('snapshot', () => {
      test('files render with props', () => {
        expect(el.snapshot).toMatchSnapshot();
      });
      test('files does not exist', () => {
        el = shallow(<PreviewDisplay {...props} files={[]} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });

    describe('component', () => {
      test('only renders compatible files', () => {
        const cards = el.instance.findByType(FileRenderer);
        expect(cards.length).toEqual(supportedTypes.length);
        cards.forEach((_, index) => {
          expect(
            cards[index].props.file,
          ).toEqual(props.files[index]);
        });
      });
    });
  });
});
