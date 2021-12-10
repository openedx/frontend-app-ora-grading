import React from 'react';
import { shallow } from 'enzyme';

import { FileTypes } from 'data/constants/files';
import { FileCard, ImageRenderer, PDFRenderer } from 'components/FilePreview';
import { PreviewDisplay } from './PreviewDisplay';

jest.mock('components/FilePreview', () => ({
  FileCard: () => 'FileCard',
  PDFRenderer: () => 'PDFRenderer',
  ImageRenderer: () => 'ImageRenderer',
}));

describe('PreviewDisplay', () => {
  describe('component', () => {
    const supportedTypes = [
      FileTypes.pdf,
      FileTypes.jpg,
      FileTypes.jpeg,
      FileTypes.bmp,
      FileTypes.png,
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
        expect(el.instance().render()).toMatchSnapshot();
      });
    });

    describe('component', () => {
      test('only renders compatible files', () => {
        const cards = el.find(FileCard);
        expect(cards.length).toEqual(supportedTypes.length);
        [0, 1, 2, 3, 4].forEach(index => {
          expect(
            cards.at(index).prop('name'),
          ).toEqual(props.files[index].name);
        });
      });
      describe('uses the correct renderers', () => {
        const loadRenderer = (index) => (
          el.find(FileCard).at(index).children().at(0)
        );
        const checkFile = (index, expectedRenderer) => {
          const file = props.files[index];
          const renderer = loadRenderer(index);
          expect(renderer.type()).toEqual(expectedRenderer);
          expect(renderer.props()).toEqual({
            url: file.downloadUrl,
            fileName: file.name,
          });
        };
        test(FileTypes.pdf, () => checkFile(0, PDFRenderer));
        test(FileTypes.jpg, () => checkFile(1, ImageRenderer));
        test(FileTypes.jpeg, () => checkFile(2, ImageRenderer));
        test(FileTypes.bmp, () => checkFile(3, ImageRenderer));
        test(FileTypes.png, () => checkFile(4, ImageRenderer));
      });
    });
  });
});
