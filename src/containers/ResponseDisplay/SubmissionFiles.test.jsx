import React from 'react';
import { shallow } from 'enzyme';

import { downloadAllLimit, downloadSingleLimit } from 'data/constants/files';

import { formatMessage } from 'testUtils';
import { SubmissionFiles } from './SubmissionFiles';
import messages from './messages';

jest.mock('./components/FileNameCell', () => jest.fn().mockName('FileNameCell'));
jest.mock('./components/FileExtensionCell', () => jest.fn().mockName('FileExtensionCell'));
jest.mock('./components/FilePopoverCell', () => jest.fn().mockName('FilePopoverCell'));
jest.mock('./FileDownload', () => 'FileDownload');

describe('SubmissionFiles', () => {
  describe('component', () => {
    const props = {
      files: [
        {
          name: 'some file name.jpg',
          description: 'description for the file',
          downloadURL: '/valid-url-wink-wink',
          size: 0,
        },
        {
          name: 'file number 2.jpg',
          description: 'description for this file',
          downloadURL: '/url-2',
          size: 0,
        },
      ],
    };
    let el;
    beforeEach(() => {
      el = shallow(<SubmissionFiles intl={{ formatMessage }} {...props} />);
    });

    describe('snapshot', () => {
      test('files existed for props', () => {
        expect(el).toMatchSnapshot();
      });

      test('files does not exist', () => {
        el.setProps({ files: [] });

        expect(el).toMatchSnapshot();
      });
      test('files size exceed', () => {
        const files = props.files.map(file => ({ ...file, size: downloadSingleLimit + 1 }));
        el.setProps({ files });
        expect(el).toMatchSnapshot();
      });
    });

    describe('behavior', () => {
      test('title', () => {
        const titleEl = el.find('.submission-files-title>h3');
        expect(titleEl.text()).toEqual(
          `${formatMessage(messages.submissionFiles)} (${props.files.length})`,
        );
        expect(el.instance().title).toEqual(
          `${formatMessage(messages.submissionFiles)} (${props.files.length})`,
        );
      });

      describe('canDownload', () => {
        test('normal file size', () => {
          expect(el.instance().canDownload).toEqual(true);
        });

        test('one of the file exceed the limit', () => {
          const oneFileExceed = [{ ...props.files[0], size: downloadSingleLimit + 1 }, props.files[1]];

          oneFileExceed.forEach(file => expect(file.size < downloadAllLimit).toEqual(true));

          el.setProps({ files: oneFileExceed });
          expect(el.instance().canDownload).toEqual(false);

          const warningEl = el.find('span.exceed-download-text');
          expect(warningEl.text().trim()).toEqual(formatMessage(messages.exceedFileSize));
        });

        test('total file size exceed the limit', () => {
          const length = 20;
          const totalFilesExceed = new Array(length).fill({
            name: 'some file name.jpg',
            description: 'description for the file',
            downloadURL: '/valid-url-wink-wink',
            size: (downloadAllLimit + 1) / length,
          });
          totalFilesExceed.forEach(file => {
            expect(file.size < downloadAllLimit).toEqual(true);
            expect(file.size < downloadSingleLimit).toEqual(true);
          });

          el.setProps({ files: totalFilesExceed });
          expect(el.instance().canDownload).toEqual(false);
        });
      });
    });
  });
});
