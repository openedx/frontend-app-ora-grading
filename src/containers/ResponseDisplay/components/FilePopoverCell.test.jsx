import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../../testUtils';

import FilePopoverCell from './FilePopoverCell';

describe('FilePopoverCell', () => {
  const props = {
    row: {
      original: {
        name: 'some file name',
        description: 'long descriptive text...',
        downloadURL: 'this-url-is.working',
        size: 1024,
      },
    },
  };

  it('renders info button has correct alt text', () => {
    renderWithIntl(<FilePopoverCell {...props} />);
    const button = screen.getByRole('button', { name: /display more info/i });
    expect(button).toBeInTheDocument();
  });

  it('handles empty row.original object', () => {
    const emptyProps = {
      row: {
        original: {},
      },
    };

    const { container } = renderWithIntl(<FilePopoverCell {...emptyProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles missing row prop', () => {
    const { container } = renderWithIntl(<FilePopoverCell />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
