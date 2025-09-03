import { screen } from '@testing-library/react';
import filesize from 'filesize';
import { renderWithIntl } from '../../testUtils';

import FilePopoverContent from '.';

jest.mock('filesize', () => (size) => `filesize(${size})`);

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
        renderWithIntl(<FilePopoverContent {...props} />);
        expect(screen.getByText(props.name)).toBeInTheDocument();
      });

      it('renders file description correctly', () => {
        renderWithIntl(<FilePopoverContent {...props} />);
        expect(screen.getByText(props.description)).toBeInTheDocument();
      });

      it('renders file size correctly', () => {
        renderWithIntl(<FilePopoverContent {...props} />);
        expect(screen.getByText(filesize(props.size))).toBeInTheDocument();
      });

      it('renders "Unknown" when size is null', () => {
        renderWithIntl(<FilePopoverContent {...props} size={null} />);
        expect(screen.getByText('Unknown')).toBeInTheDocument();
      });
    });
  });
});
