import { render } from '@testing-library/react';
import FileExtensionCell from './FileExtensionCell';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('FileExtensionCell', () => {
  const props = {
    value: 'file_name.with_extension.pdf',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file extension in uppercase', () => {
    const { getByText } = render(<FileExtensionCell {...props} />);
    expect(getByText('PDF')).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<FileExtensionCell {...props} />);
    const element = container.firstChild;
    expect(element).toHaveClass('text-truncate');
  });

  it('extracts extension from file with multiple dots', () => {
    const { getByText } = render(<FileExtensionCell value="my.file.name.docx" />);
    expect(getByText('DOCX')).toBeInTheDocument();
  });

  it('handles file without extension', () => {
    const { getByText } = render(<FileExtensionCell value="filename" />);
    expect(getByText('FILENAME')).toBeInTheDocument();
  });

  it('handles empty file extension', () => {
    const { container } = render(<FileExtensionCell value="filename." />);
    const element = container.firstChild;
    expect(element).toHaveTextContent('');
  });
});
