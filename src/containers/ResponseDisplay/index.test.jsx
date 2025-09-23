import { MathJaxContext } from 'better-react-mathjax';

import { render, screen } from '@testing-library/react';
import { fileUploadResponseOptions } from 'data/services/lms/constants';
import { selectors } from 'data/redux';
import { ResponseDisplay, mapStateToProps } from '.';

jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      selected: {
        response: jest.fn((state) => state.response || { text: [], files: [] }),
      },
    },
    app: {
      ora: {
        fileUploadResponseConfig: jest.fn((state) => state.fileUploadResponseConfig || 'optional'),
      },
    },
  },
}));

jest.mock('./SubmissionFiles', () => jest.fn(({ files }) => (
  <div data-testid="submission-files">Files: {files.length}</div>
)));

jest.mock('./PreviewDisplay', () => jest.fn(({ files }) => (
  <div data-testid="preview-display">Preview: {files.length}</div>
)));

jest.mock('dompurify', () => () => ({
  sanitize: (text) => text,
}));

jest.mock('html-react-parser', () => (text) => text);

describe('ResponseDisplay', () => {
  const defaultProps = {
    response: {
      text: ['some text response here', 'another text response'],
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

  beforeAll(() => {
    global.window = {};
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders response display container', () => {
      const { container } = render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} />
        </MathJaxContext>,
      );
      const responseDisplay = container.querySelector('.response-display');
      expect(responseDisplay).toBeInTheDocument();
    });

    it('displays text content in cards', () => {
      const { container } = render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} />
        </MathJaxContext>,
      );
      const textContents = container.querySelectorAll('.response-display-text-content');
      expect(textContents).toHaveLength(defaultProps.response.text.length);
      expect(textContents[0]).toHaveTextContent('some text response here');
      expect(textContents[1]).toHaveTextContent('another text response');
    });

    it('displays submission files when file upload is allowed', () => {
      render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} />
        </MathJaxContext>,
      );
      const submissionFiles = screen.getByTestId('submission-files');
      expect(submissionFiles).toBeInTheDocument();
      expect(submissionFiles).toHaveTextContent('Files: 2');
    });

    it('displays preview display when file upload is allowed', () => {
      render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} />
        </MathJaxContext>,
      );
      const previewDisplay = screen.getByTestId('preview-display');
      expect(previewDisplay).toBeInTheDocument();
      expect(previewDisplay).toHaveTextContent('Preview: 2');
    });

    it('does not display file components when file upload is disabled', () => {
      render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} fileUploadResponseConfig={fileUploadResponseOptions.none} />
        </MathJaxContext>,
      );
      expect(screen.queryByTestId('submission-files')).not.toBeInTheDocument();
      expect(screen.queryByTestId('preview-display')).not.toBeInTheDocument();
    });

    it('renders empty content when no text response provided', () => {
      const { container } = render(
        <MathJaxContext>
          <ResponseDisplay {...defaultProps} response={{ text: [], files: [] }} />
        </MathJaxContext>,
      );
      const textContents = container.querySelectorAll('.response-display-text-content');
      expect(textContents).toHaveLength(0);
    });
  });

  describe('mapStateToProps', () => {
    const testState = {
      response: {
        text: ['test text'],
        files: ['file1', 'file2'],
      },
      fileUploadResponseConfig: 'required',
    };

    it('maps response from grading.selected.response selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.response).toEqual(selectors.grading.selected.response(testState));
    });

    it('maps fileUploadResponseConfig from app.ora.fileUploadResponseConfig selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.fileUploadResponseConfig).toEqual(selectors.app.ora.fileUploadResponseConfig(testState));
    });
  });
});
