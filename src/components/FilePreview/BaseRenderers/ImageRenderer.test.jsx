import React from 'react';
import { render, screen } from '@testing-library/react';

import ImageRenderer from './ImageRenderer';

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.jpg',
    fileName: 'test-image.jpg',
    onError: jest.fn().mockName('this.props.onError'),
    onSuccess: jest.fn().mockName('this.props.onSuccess'),
  };

  it('renders an image with the correct src and alt attributes', () => {
    render(<ImageRenderer {...props} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', props.url);
    expect(imgElement).toHaveAttribute('alt', props.fileName);
    expect(imgElement).toHaveClass('image-renderer');
  });

  it('calls onSuccess when image loads successfully', () => {
    render(<ImageRenderer {...props} />);

    const imgElement = screen.getByRole('img');
    imgElement.dispatchEvent(new Event('load'));

    expect(props.onSuccess).toHaveBeenCalled();
  });

  it('calls onError when image fails to load', () => {
    render(<ImageRenderer {...props} />);

    const imgElement = screen.getByRole('img');
    imgElement.dispatchEvent(new Event('error'));

    expect(props.onError).toHaveBeenCalled();
  });
});
