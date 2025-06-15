import { render } from '@testing-library/react';

import filesize from 'filesize';
import FilePopoverContent from '.';

jest.mock('filesize', () => (size) => `filesize(${size})`);
jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('FilePopoverContent', () => {
  describe('component', () => {
    const props = {
      name: 'some file name',
      description: 'long descriptive text...',
      downloadURL: 'this-url-is.working',
      size: 6000,
    };

    describe('behavior', () => {
      it('renders file name correctly', () => {
        const { getByText } = render(<FilePopoverContent {...props} />);
        expect(getByText(props.name)).toBeInTheDocument();
      });

      it('renders file description correctly', () => {
        const { getByText } = render(<FilePopoverContent {...props} />);
        expect(getByText(props.description)).toBeInTheDocument();
      });

      it('renders file size correctly', () => {
        const { getByText } = render(<FilePopoverContent {...props} />);
        expect(getByText(filesize(props.size))).toBeInTheDocument();
      });

      it('renders "Unknown" when size is null', () => {
        const { getByText } = render(<FilePopoverContent {...props} size={null} />);
        expect(getByText('Unknown')).toBeInTheDocument();
      });
    });
  });
});
