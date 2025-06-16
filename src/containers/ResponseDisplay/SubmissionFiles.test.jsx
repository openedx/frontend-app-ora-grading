import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { downloadAllLimit, downloadSingleLimit } from 'data/constants/files';
import { SubmissionFiles } from './SubmissionFiles';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('./components/FileNameCell', () => jest.fn(({ value }) => <div>Name: {value}</div>));
jest.mock('./components/FileExtensionCell', () => jest.fn(({ value }) => <div>Extension: {value}</div>));
jest.mock('./components/FilePopoverCell', () => jest.fn(() => <div>Popover</div>));
jest.mock('./FileDownload', () => jest.fn(({ files }) => <div data-testid="file-download">Download {files.length} files</div>));

describe('SubmissionFiles', () => {
  const defaultProps = {
    files: [
      {
        name: 'some file name.jpg',
        description: 'description for the file',
        downloadURL: '/valid-url-wink-wink',
        size: 100,
      },
      {
        name: 'file number 2.jpg',
        description: 'description for this file',
        downloadURL: '/url-2',
        size: 200,
      },
    ],
  };

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('displays submission files title with file count', () => {
      renderWithIntl(<SubmissionFiles {...defaultProps} />);
      const title = screen.getByTestId('submission-files-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(`Submission Files (${defaultProps.files.length})`);
    });

    it('renders file download component when files can be downloaded', () => {
      renderWithIntl(<SubmissionFiles {...defaultProps} />);
      const downloadComponent = screen.getByTestId('file-download');
      expect(downloadComponent).toBeInTheDocument();
      expect(downloadComponent).toHaveTextContent('Download 2 files');
    });

    it('displays warning when individual file exceeds size limit', () => {
      const largeFileProps = {
        ...defaultProps,
        files: [
          { ...defaultProps.files[0], size: downloadSingleLimit + 1 },
          defaultProps.files[1],
        ],
      };
      renderWithIntl(<SubmissionFiles {...largeFileProps} />);

      expect(screen.queryByTestId('file-download')).not.toBeInTheDocument();
      const warningText = screen.getByTestId('exceed-download-text');
      expect(warningText).toBeInTheDocument();
      expect(warningText).toHaveTextContent('Exceeded the allow download size');
    });

    it('displays warning when total file size exceeds limit', () => {
      const largeFileSize = (downloadAllLimit + 1) / 20;
      const largeFilesProps = {
        ...defaultProps,
        files: Array(20).fill({
          name: 'large file.jpg',
          description: 'large file description',
          downloadURL: '/large-file-url',
          size: largeFileSize,
        }),
      };
      renderWithIntl(<SubmissionFiles {...largeFilesProps} />);

      expect(screen.queryByTestId('file-download')).not.toBeInTheDocument();
    });

    it('displays title only when no files are provided', () => {
      const { container } = renderWithIntl(<SubmissionFiles {...defaultProps} files={[]} />);
      const title = container.querySelector('.submission-files-title h3');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Submission Files (0)');
      expect(screen.queryByTestId('file-download')).not.toBeInTheDocument();
    });

    it('renders data table with correct file information', () => {
      const { container } = renderWithIntl(<SubmissionFiles {...defaultProps} />);
      const dataTable = container.querySelector('.submission-files-table');
      expect(dataTable).toBeInTheDocument();
    });
  });
});
