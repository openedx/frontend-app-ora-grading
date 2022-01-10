import React from 'react';
import { shallow } from 'enzyme';

import { FileTypes } from 'data/constants/files';
import { FileRenderer } from 'components/FilePreview';
import { PreviewDisplay } from './PreviewDisplay';

jest.mock('components/FilePreview', () => ({
  FileRenderer: () => 'FileRenderer',
  isSupported: (file) => jest.requireActual('components/FilePreview').isSupported(file),
}));

describe('PreviewDisplay', () => {
  describe('component', () => {
    const supportedTypes = [
      FileTypes.pdf,
      FileTypes.jpg,
      FileTypes.jpeg,
      FileTypes.bmp,
      FileTypes.png,
      FileTypes.txt,
    ];
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
      test('files does not exist', () => {
        expect(el).toMatchSnapshot();
      });
      test('files exited for props', () => {
        el.setProps({ files: [] });
        expect(el).toMatchSnapshot();
      });
    });

    describe('component', () => {
      test('only renders compatible files', () => {
        const cards = el.find(FileRenderer);
        expect(cards.length).toEqual(supportedTypes.length);
        new Array(cards.length).fill(0).forEach((_, index) => {
          expect(
            cards.at(index).prop('file'),
          ).toEqual(props.files[index]);
        });
      });
    });
  });
});
