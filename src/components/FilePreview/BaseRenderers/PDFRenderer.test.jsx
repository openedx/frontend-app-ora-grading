import { Document, Page } from 'react-pdf';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import PDFRenderer from './PDFRenderer';
import * as hooks from './pdfHooks';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: jest.fn(),
  Page: jest.fn(),
}));

Document.mockImplementation((props) => <div data-testid="pdf-document">{props.children}</div>);
Document.propTypes = {
  children: PropTypes.node,
};

Page.mockImplementation(() => <div data-testid="pdf-page">Page Content</div>);

jest.mock('./pdfHooks', () => ({
  rendererHooks: jest.fn(),
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('PDF Renderer Component', () => {
  const props = {
    url: 'some_url.pdf',
    onError: jest.fn().mockName('this.props.onError'),
    onSuccess: jest.fn().mockName('this.props.onSuccess'),
  };
  const hookProps = {
    pageNumber: 1,
    numPages: 10,
    relativeHeight: 200,
    wrapperRef: { current: 'hooks.wrapperRef' },
    onDocumentLoadSuccess: jest.fn().mockName('hooks.onDocumentLoadSuccess'),
    onLoadPageSuccess: jest.fn().mockName('hooks.onLoadPageSuccess'),
    onDocumentLoadError: jest.fn().mockName('hooks.onDocumentLoadError'),
    onInputPageChange: jest.fn().mockName('hooks.onInputPageChange'),
    onNextPageButtonClick: jest.fn().mockName('hooks.onNextPageButtonClick'),
    onPrevPageButtonClick: jest.fn().mockName('hooks.onPrevPageButtonClick'),
    hasNext: true,
    hasPrev: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the PDF document with navigation controls', () => {
      hooks.rendererHooks.mockReturnValue(hookProps);
      const { getByTestId, getAllByText, container } = render(<PDFRenderer {...props} />);
      expect(getByTestId('pdf-document')).toBeInTheDocument();
      expect(getByTestId('pdf-page')).toBeInTheDocument();
      expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
      expect(getAllByText(/Page/).length).toBeGreaterThan(0);
      expect(getAllByText(`of ${hookProps.numPages}`).length).toBeGreaterThan(0);
    });

    it('should have disabled previous button when on the first page', () => {
      hooks.rendererHooks.mockReturnValue({
        ...hookProps,
        hasPrev: false,
      });

      const { container } = render(<PDFRenderer {...props} />);
      const prevButton = container.querySelector('button[aria-label="previous pdf page"]');
      expect(prevButton).toBeDisabled();
    });

    it('should have disabled next button when on the last page', () => {
      hooks.rendererHooks.mockReturnValue({
        ...hookProps,
        hasNext: false,
        hasPrev: true,
      });

      const { container } = render(<PDFRenderer {...props} />);
      const nextButton = container.querySelector('button[aria-label="next pdf page"]');
      expect(nextButton).toBeDisabled();
    });
  });
});
