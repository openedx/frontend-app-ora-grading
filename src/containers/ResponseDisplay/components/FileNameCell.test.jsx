import React from 'react';
import { render, screen } from '@testing-library/react';

import FileNameCell from './FileNameCell';

describe('FileNameCell', () => {
  const props = {
    value: 'some test text value',
  };

  it('renders the value text', () => {
    render(<FileNameCell {...props} />);
    expect(screen.getByText('some test text value')).toBeInTheDocument();
  });

  it('applies text truncation class', () => {
    const { container } = render(<FileNameCell {...props} />);
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass('text-truncate');
  });
});
