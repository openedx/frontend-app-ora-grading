import { render, screen } from '@testing-library/react';
import { keyStore } from 'utils';
import { ErrorStatuses } from 'data/constants/requests';
import { FileRenderer } from './FileRenderer';
import * as hooks from './hooks';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const hookKeys = keyStore(hooks);

const props = {
  file: {
    downloadUrl: 'file download url',
    name: 'filename.txt',
    description: 'A text file',
  },
};
describe('FileRenderer', () => {
  describe('component', () => {
    it('renders loading banner when isLoading is true', () => {
      const hookProps = {
        Renderer: () => <div data-testid="mock-renderer">Renderer Component</div>,
        isLoading: true,
        errorStatus: null,
        error: null,
        rendererProps: { prop: 'hooks.rendererProps' },
      };
      jest.spyOn(hooks, hookKeys.renderHooks).mockReturnValueOnce(hookProps);
      render(<FileRenderer {...props} />);

      expect(screen.getByText('filename.txt')).toBeInTheDocument();
      expect(screen.getByTestId('mock-renderer')).toBeInTheDocument();
      const spinner = document.querySelector('.spinner-border');
      expect(spinner).toBeInTheDocument();
    });
    it('renders error banner when there is an error status', () => {
      const errorProps = {
        headingMessage: { id: 'error.heading', defaultMessage: 'Error Heading' },
        children: 'Error Message',
        actions: [{ id: 'retry', onClick: jest.fn(), message: { id: 'retry', defaultMessage: 'Retry' } }],
      };

      const hookProps = {
        Renderer: () => <div data-testid="mock-renderer">Renderer Component</div>,
        isLoading: false,
        errorStatus: ErrorStatuses.serverError,
        error: errorProps,
        rendererProps: { prop: 'hooks.rendererProps' },
      };
      jest.spyOn(hooks, hookKeys.renderHooks).mockReturnValueOnce(hookProps);

      render(<FileRenderer {...props} />);

      expect(screen.getByText('filename.txt')).toBeInTheDocument();
      expect(screen.getByText('Error Message')).toBeInTheDocument();
      expect(document.querySelector('.alert-heading')).toBeInTheDocument();
      expect(document.querySelector('.btn.btn-outline-primary')).toBeInTheDocument();
    });

    it('renders renderer component when not loading and no error', () => {
      const hookProps = {
        Renderer: () => <div data-testid="mock-renderer">Renderer Component</div>,
        isLoading: false,
        errorStatus: null,
        error: null,
        rendererProps: { prop: 'hooks.rendererProps' },
      };
      jest.spyOn(hooks, hookKeys.renderHooks).mockReturnValueOnce(hookProps);

      render(<FileRenderer {...props} />);

      expect(screen.getByText('filename.txt')).toBeInTheDocument();
      expect(screen.getByTestId('mock-renderer')).toBeInTheDocument();
      expect(screen.getByText('Renderer Component')).toBeInTheDocument();

      const spinner = document.querySelector('.spinner-border');
      expect(spinner).not.toBeInTheDocument();
    });
  });
});
