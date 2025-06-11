import { render, screen } from '@testing-library/react';
import FileCard from './FileCard';

jest.mock('components/FilePopoverContent', () => 'FilePopoverContent');
jest.mock('./FileInfo', () => 'FileInfo');
jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('File Preview Card component', () => {
  const props = {
    file: {
      name: 'test-file-name.pdf',
      description: 'test-file description',
      downloadUrl: 'destination/test-file-name.pdf',
    },
  };
  const children = (<h1>some children</h1>);

  describe('Component', () => {
    it('renders with the file name in the title', () => {
      render(<FileCard {...props}>{children}</FileCard>);
      expect(screen.getByText(props.file.name)).toBeInTheDocument();
      expect(screen.getByText(props.file.name)).toHaveClass('file-card-title');
    });

    it('renders the preview panel with file info', () => {
      render(<FileCard {...props}>{children}</FileCard>);
      const previewPanel = screen.getByTestId('preview-panel');
      expect(previewPanel).toBeInTheDocument();
      expect(document.querySelector('FileInfo')).toBeInTheDocument();
      expect(document.querySelector('FilePopoverContent')).toBeInTheDocument();
    });

    it('renders children in the preview panel', () => {
      render(<FileCard {...props}>{children}</FileCard>);
      const previewPanel = screen.getByTestId('preview-panel');
      expect(previewPanel).toBeInTheDocument();
      expect(screen.getByText('some children')).toBeInTheDocument();
    });
  });
});
