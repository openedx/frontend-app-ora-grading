import React from 'react';
import { shallow } from 'enzyme';

import { FileTypes } from 'data/constants/files';
import {
  ImageRenderer,
  PDFRenderer,
  TXTRenderer,
} from 'components/FilePreview/BaseRenderers';
import {
  FileRenderer, getFileType, ERROR_STATUSES, RENDERERS,
} from './FileRenderer';

jest.mock('./FileCard', () => 'FileCard');

jest.mock('components/FilePreview/BaseRenderers', () => ({
  PDFRenderer: () => 'PDFRenderer',
  ImageRenderer: () => 'ImageRenderer',
  TXTRenderer: () => 'TXTRenderer',
}));

jest.mock('./Banners', () => ({
  ErrorBanner: () => 'ErrorBanner',
  LoadingBanner: () => 'LoadingBanner',
}));

describe('FileRenderer', () => {
  describe('component', () => {
    const supportedTypes = [
      FileTypes.pdf,
      FileTypes.jpg,
      FileTypes.jpeg,
      FileTypes.bmp,
      FileTypes.png,
      FileTypes.txt,
    ];
    const files = [
      ...supportedTypes.map((fileType, index) => ({
        name: `fake_file_${index}.${fileType}`,
        description: `file description ${index}`,
        downloadUrl: `/url-path/fake_file_${index}.${fileType}`,
      })),
    ];

    const els = files.map((file) => shallow(<FileRenderer file={file} />));

    describe('snapshot', () => {
      els.forEach((el) => {
        const file = el.prop('file');
        const fileType = getFileType(file.name);

        test(`successful rendering ${fileType}`, () => {
          // I prefer to invoke this method for changing state.
          // It is consistence behavior even though it is not as pretty in snapshot.
          el.instance().onSuccess();
          expect(el.instance().render()).toMatchSnapshot();
        });
      });

      Object.keys(ERROR_STATUSES).forEach((status) => {
        test(`has error ${status}`, () => {
          const el = shallow(<FileRenderer file={files[0]} />);
          el.instance().onError(ERROR_STATUSES[status]);
          expect(el.instance().render()).toMatchSnapshot();
        });
      });
    });

    describe('component', () => {
      describe('uses the correct renderers', () => {
        const checkFile = (index, expectedRenderer) => {
          const file = files[index];
          const el = shallow(<FileRenderer file={file} />);
          const renderer = el.find(expectedRenderer);
          expect(renderer).toBeDefined();
          expect(renderer.prop('url')).toEqual(file.downloadUrl);
          expect(renderer.prop('fileName')).toEqual(file.name);
        };
        // the manual process for this is prefer.
        test(FileTypes.pdf, () => checkFile(0, PDFRenderer));
        test(FileTypes.jpg, () => checkFile(1, ImageRenderer));
        test(FileTypes.jpeg, () => checkFile(2, ImageRenderer));
        test(FileTypes.bmp, () => checkFile(3, ImageRenderer));
        test(FileTypes.png, () => checkFile(4, ImageRenderer));
        test(FileTypes.txt, () => checkFile(5, TXTRenderer));
      });
    });

    describe('renderer constraints', () => {
      els.forEach((el) => {
        const file = el.prop('file');
        const fileType = getFileType(file.name);
        const RendererComponent = RENDERERS[fileType];
        const ActualRendererComponent = jest.requireActual(
          'components/FilePreview/BaseRenderers',
        )[RendererComponent.name];

        it(`${fileType} renderer must have onError and onSuccess props`, () => {
          /* eslint-disable react/forbid-foreign-prop-types */
          expect(ActualRendererComponent.propTypes.onError).toBeDefined();
          expect(ActualRendererComponent.propTypes.onSuccess).toBeDefined();
        });
      });
    });
  });
});
