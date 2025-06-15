import { render } from '@testing-library/react';
import TXTRenderer from './TXTRenderer';

jest.mock('./textHooks', () => {
  const mockRendererHooks = jest.fn().mockReturnValue({ content: 'test-content' });
  return {
    rendererHooks: mockRendererHooks,
  };
});

jest.unmock('@openedx/paragon');
jest.unmock('react');

const textHooks = require('./textHooks');

describe('TXT Renderer Component', () => {
  const props = {
    url: 'some_url.txt',
    onError: jest.fn().mockName('this.props.onError'),
    onSuccess: jest.fn().mockName('this.props.onSuccess'),
  };

  beforeEach(() => {
    textHooks.rendererHooks.mockClear();
  });

  it('renders the text content in a pre element', () => {
    const { getByText, container } = render(<TXTRenderer {...props} />);
    expect(getByText('test-content')).toBeInTheDocument();
    expect(container.querySelector('pre')).toHaveClass('txt-renderer');
  });

  it('passes the correct props to rendererHooks', () => {
    render(<TXTRenderer {...props} />);
    expect(textHooks.rendererHooks).toHaveBeenCalledWith({
      url: props.url,
      onError: props.onError,
      onSuccess: props.onSuccess,
    });
  });
});
