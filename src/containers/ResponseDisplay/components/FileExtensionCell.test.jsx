import { render, screen } from '@testing-library/react';
import FileExtensionCell from './FileExtensionCell';

describe('FileExtensionCell', () => {
  const props = {
    value: 'file_name.with_extension.pdf',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file extension in uppercase', () => {
    render(<FileExtensionCell {...props} />);
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const { container } = render(<FileExtensionCell {...props} />);
    const element = container.firstChild;
    expect(element).toHaveClass('text-truncate');
  });

  it('extracts extension from file with multiple dots', () => {
    render(<FileExtensionCell value="my.file.name.docx" />);
    expect(screen.getByText('DOCX')).toBeInTheDocument();
  });

  it('handles file without extension', () => {
    render(<FileExtensionCell value="filename" />);
    expect(screen.getByText('FILENAME')).toBeInTheDocument();
  });

  it('handles empty file extension', () => {
    const { container } = render(<FileExtensionCell value="filename." />);
    const element = container.firstChild;
    expect(element).toHaveTextContent('');
  });
});
