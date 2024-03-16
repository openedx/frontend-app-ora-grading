import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import createDOMPurify from 'dompurify';
import parse from 'html-react-parser';

import { fileUploadResponseOptions } from 'data/services/lms/constants';
import { selectors } from 'data/redux';

import { ResponseDisplay, mapStateToProps } from '.';

jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      selected: {
        response: (state) => ({ response: state }),
      },
    },
    app: {
      ora: {
        fileUploadResponseConfig: (state) => ({ config: state }),
      },
    },
  },
}));
jest.mock('./SubmissionFiles', () => 'SubmissionFiles');
jest.mock('dompurify', () => () => ({
  sanitize: (text) => `sanitized (${text})`,
}));
jest.mock('html-react-parser', () => (text) => `parsed html (${text})`);

describe('ResponseDisplay', () => {
  describe('component', () => {
    const props = {
      response: {
        text: ['some text response here'],
        files: [
          {
            name: 'some file name.jpg',
            description: 'description for the file',
            downloadURL: '/valid-url-wink-wink',
          },
          {
            name: 'file number 2.jpg',
            description: 'description for this file',
            downloadURL: '/url-2',
          },
        ],
      },
      fileUploadResponseConfig: 'optional',
    };
    let el;
    beforeAll(() => {
      global.window = {};
    });
    beforeEach(() => {
      el = shallow(<ResponseDisplay {...props} />);
    });
    describe('snapshot', () => {
      test('file upload enable with valid response', () => {
        expect(el.snapshot).toMatchSnapshot();
      });

      test('file upload enable without response', () => {
        el = shallow(<ResponseDisplay {...props} response={{ text: [], files: [] }} />);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('file upload disable with valid response', () => {
        el = shallow(<ResponseDisplay {...props} fileUploadResponseConfig={fileUploadResponseOptions.none} />);
        expect(el.snapshot).toMatchSnapshot();
      });

      test('file upload disabled without response', () => {
        el = shallow(<ResponseDisplay {...props} response={{ text: [], files: [] }} />);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
    describe('behavior', () => {
      test('get textContents', () => {
        const textContents = el.instance.findByTestId('response-display-text-content');
        expect(textContents.length).toEqual(
          props.response.text.length,
        );
        textContents.forEach((text, index) => {
          expect(text.el.children[0]).toEqual(
            parse(createDOMPurify(window).sanitize(props.response.text[index])),
          );
        });
      });

      test('get submittedFiles', () => {
        expect(el.instance.findByTestId('submission-files')[0].props.files).toEqual(props.response.files);
      });
      test('get allowFileUpload', () => {
        expect(el.instance.findByTestId('allow-file-upload').length > 0).toEqual(
          props.fileUploadResponseConfig !== fileUploadResponseOptions.none,
        );
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = {
      dummyText: ['text'],
      dummyFiles: ['files', 'file-2'],
    };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('response loads from grading.selected.response', () => {
      expect(mapped.response).toEqual(
        selectors.grading.selected.response(testState),
      );
    });
    test('response loads from grading.selected.response', () => {
      expect(mapped.fileUploadResponseConfig).toEqual(
        selectors.app.ora.fileUploadResponseConfig(testState),
      );
    });
  });
});
