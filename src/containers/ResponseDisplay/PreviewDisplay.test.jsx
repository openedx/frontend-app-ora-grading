import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { FileTypes } from 'data/constants/files';
import { PreviewDisplay } from './PreviewDisplay';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders preview display container', () => {
    const { container } = renderWithIntl(<PreviewDisplay {...props} />);
    const previewDisplay = container.querySelector('.preview-display');
    expect(previewDisplay).toBeInTheDocument();
  });

  it('renders empty container when no files provided', () => {
    const { container } = renderWithIntl(<PreviewDisplay files={[]} />);
    const previewDisplay = container.querySelector('.preview-display');
    expect(previewDisplay).toBeInTheDocument();
    expect(previewDisplay.children.length).toBe(0);
  });

  it('only renders supported file types', () => {
    const { container } = renderWithIntl(<PreviewDisplay {...props} />);
    const previewDisplay = container.querySelector('.preview-display');
    expect(previewDisplay.children.length).toBe(supportedTypes.length);
  });

  it('filters out unsupported file types', () => {
    const unsupportedFile = {
      name: 'unsupported.xyz',
      description: 'unsupported file',
      downloadUrl: '/unsupported.xyz',
    };
    const { container } = renderWithIntl(<PreviewDisplay files={[unsupportedFile]} />);
    const previewDisplay = container.querySelector('.preview-display');
    expect(previewDisplay.children.length).toBe(0);
  });
});
