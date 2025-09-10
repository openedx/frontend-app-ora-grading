import { screen } from '@testing-library/react';
import { FileTypes } from 'data/constants/files';
import { renderWithIntl } from '../../testUtils';
import { PreviewDisplay } from './PreviewDisplay';

describe('PreviewDisplay', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders preview display container', () => {
    renderWithIntl(<PreviewDisplay {...props} />);
    const previewDisplay = screen.getByRole('button', { name: 'fake_file_0.pdf' });
    expect(previewDisplay).toBeInTheDocument();
  });

  it('renders empty container when no files provided', () => {
    renderWithIntl(<PreviewDisplay files={[]} />);
    const previewDisplay = document.querySelector('.preview-display');
    expect(previewDisplay).toBeInTheDocument();
    expect(previewDisplay.children.length).toBe(0);
  });

  it('only renders supported file types', () => {
    renderWithIntl(<PreviewDisplay {...props} />);
    const previewDisplay = document.querySelector('.preview-display');
    expect(previewDisplay.children.length).toBe(supportedTypes.length);
  });

  it('filters out unsupported file types', () => {
    const unsupportedFile = {
      name: 'unsupported.xyz',
      description: 'unsupported file',
      downloadUrl: '/unsupported.xyz',
    };
    renderWithIntl(<PreviewDisplay files={[unsupportedFile]} />);
    const previewDisplay = document.querySelector('.preview-display');
    expect(previewDisplay.children.length).toBe(0);
  });
});
