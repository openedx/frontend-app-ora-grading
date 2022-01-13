import React from 'react';
import { shallow } from 'enzyme';

import { FileTypes } from 'data/constants/files';
import {
  ImageRenderer,
  PDFRenderer,
  TXTRenderer,
} from 'components/FilePreview/BaseRenderers';
import {
  FileRenderer,
  getFileType,
  ERROR_STATUSES,
  RENDERERS,
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
    const supportedTypes = Object.keys(RENDERERS);
    const files = [
      ...supportedTypes.map((fileType, index) => ({
        name: `fake_file_${index}.${fileType}`,
        description: `file description ${index}`,
        downloadUrl: `/url-path/fake_file_${index}.${fileType}`,
      })),
    ];

    const els = files.map((file) => {
      const el = shallow(<FileRenderer file={file} />);
      el.instance().onError = jest.fn().mockName('this.props.onError');
      el.instance().onSuccess = jest.fn().mockName('this.props.onSuccess');
      return el;
    });

    describe('snapshot', () => {
      els.forEach((el) => {
        const file = el.prop('file');
        const fileType = getFileType(file.name);

        test(`successful rendering ${fileType}`, () => {
          el.setState({ isLoading: false });
          expect(el.instance().render()).toMatchSnapshot();
        });
      });

      Object.keys(ERROR_STATUSES).forEach((status) => {
        test(`has error ${status}`, () => {
          const el = shallow(<FileRenderer file={files[0]} />);
          el.instance().setState({
            errorStatus: status,
            isLoading: false,
          });
          el.instance().resetState = jest.fn().mockName('this.resetState');
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
          const { url, fileName } = renderer.props();

          expect(renderer).toBeDefined();
          expect(url).toEqual(file.downloadUrl);
          expect(fileName).toEqual(file.name);
        };
        /**
         * The manual process for this is prefer. I want to be more explicit
         * of which file correspond to which renderer. If I use RENDERERS dicts,
         * this wouldn't be a test.
         */

        test(FileTypes.pdf, () => checkFile(0, PDFRenderer));
        test(FileTypes.jpg, () => checkFile(1, ImageRenderer));
        test(FileTypes.jpeg, () => checkFile(2, ImageRenderer));
        test(FileTypes.bmp, () => checkFile(3, ImageRenderer));
        test(FileTypes.png, () => checkFile(4, ImageRenderer));
        test(FileTypes.txt, () => checkFile(5, TXTRenderer));
      });

      test('getter for error', () => {
        const el = els[0];
        Object.keys(ERROR_STATUSES).forEach((status) => {
          el.setState({
            isLoading: false,
            errorStatus: status,
          });
          const { actions, ...expectedError } = el.instance().error;
          expect(ERROR_STATUSES[status]).toEqual(expectedError);
        });
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

        test(`${fileType} renderer must have onError and onSuccess props`, () => {
          /* eslint-disable react/forbid-foreign-prop-types */
          expect(ActualRendererComponent.propTypes.onError).toBeDefined();
          expect(ActualRendererComponent.propTypes.onSuccess).toBeDefined();
        });
      });
    });
  });
});
