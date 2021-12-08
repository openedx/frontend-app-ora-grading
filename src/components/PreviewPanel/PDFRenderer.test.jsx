import React from 'react';
import { shallow } from 'enzyme';

import PDFRenderer from './PDFRenderer';

describe('PDF Renderer Component', () => {
  const props = {
    url: 'some_url.pdf',
  };

  let el;
  beforeEach(() => {
    el = shallow(<PDFRenderer {...props} />);
    el.instance().onDocumentLoadSuccess = jest
      .fn()
      .mockName('onDocumentLoadSuccess');
    el.instance().onDocumentLoadError = jest
      .fn()
      .mockName('onDocumentLoadError');
    el.instance().onLoadPageSuccess = jest.fn().mockName('onLoadPageSuccess');
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('Component', () => {
    const supportedTypes = ['pdf'];
    test('static supported types is expected', () => {
      expect(PDFRenderer.supportedTypes).toEqual(supportedTypes);
    });

    describe('state', () => {
      const state = { numPages: 10 };
      describe('get hasPrev', () => {
        test('enable', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const { hasPrev } = el.instance();
          expect(hasPrev).toEqual(true);
          const rightArrowEl = el.find('IconButton').at(0);
          expect(rightArrowEl.prop('disabled')).toEqual(!hasPrev);
        });
        test('disabled', () => {
          el.setState({ pageNumber: 1, ...state });
          const { hasPrev } = el.instance();
          expect(hasPrev).toEqual(false);
          const rightArrowEl = el.find('IconButton').at(0);
          expect(rightArrowEl.prop('disabled')).toEqual(!hasPrev);
        });
      });
      describe('get hasNext', () => {
        test('enable', () => {
          el.setState({ pageNumber: 1, ...state });
          const { hasNext } = el.instance();
          expect(hasNext).toEqual(true);
          const leftArrowEl = el.find('IconButton').at(1);
          expect(leftArrowEl.prop('disabled')).toEqual(!hasNext);
        });
        test('disabled', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const { hasNext } = el.instance();
          expect(hasNext).toEqual(false);
          const leftArrowEl = el.find('IconButton').at(1);
          expect(leftArrowEl.prop('disabled')).toEqual(!hasNext);
        });
      });
    });
  });
});
