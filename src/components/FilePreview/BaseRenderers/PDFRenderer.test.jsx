import React from 'react';
import { shallow } from 'enzyme';

import PDFRenderer from './PDFRenderer';

import * as hooks from './pdfHooks';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: () => 'Document',
  Page: () => 'Page',
}));

jest.mock('./pdfHooks', () => ({
  rendererHooks: jest.fn(),
}));

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
    hasPref: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('snapshots', () => {
    test('first page, prev is disabled', () => {
      hooks.rendererHooks.mockReturnValue(hookProps);
      expect(shallow(<PDFRenderer {...props} />)).toMatchSnapshot();
    });
    test('on last page, next is disabled', () => {
      hooks.rendererHooks.mockReturnValue({
        ...hookProps,
        pageNumber: hookProps.numPages,
        hasNext: false,
        hasPrev: true,
      });
      expect(shallow(<PDFRenderer {...props} />)).toMatchSnapshot();
    });
  });
});
