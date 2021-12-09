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
    el.instance().onPrevPageButtonClick = jest
      .fn()
      .mockName('onPrevPageButtonClick');
    el.instance().onNextPageButtonClick = jest
      .fn()
      .mockName('onNextPageButtonClick');
    el.instance().onInputPageChange = jest.fn().mockName('onInputPageChange');
    expect(el.instance().render()).toMatchSnapshot();
  });

  describe('Component', () => {
    const supportedTypes = ['pdf'];
    test('static supported types is expected', () => {
      expect(PDFRenderer.supportedTypes).toEqual(supportedTypes);
    });

    describe('state', () => {
      const state = { numPages: 10 };
      describe('previous page button', () => {
        test('enable', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const { hasPrev } = el.instance();
          const PrevButtonEl = el.find('IconButton').at(0);
          expect(hasPrev).toEqual(true);
          expect(PrevButtonEl.prop('disabled')).toEqual(!hasPrev);
        });
        test('disabled', () => {
          el.setState({ pageNumber: 1, ...state });
          const { hasPrev } = el.instance();
          const PrevButtonEl = el.find('IconButton').at(0);
          expect(hasPrev).toEqual(false);
          expect(PrevButtonEl.prop('disabled')).toEqual(!hasPrev);
        });

        test('onPrevPageButtonClick', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const PrevButtonEl = el.find('IconButton').at(0);
          PrevButtonEl.simulate('click');
          expect(el.state('pageNumber')).toEqual(state.numPages - 1);
        });
      });

      describe('next page button', () => {
        test('enable', () => {
          el.setState({ pageNumber: 1, ...state });
          const { hasNext } = el.instance();
          expect(hasNext).toEqual(true);
          const NextButtonEl = el.find('IconButton').at(1);
          expect(NextButtonEl.prop('disabled')).toEqual(!hasNext);
        });
        test('disabled', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const { hasNext } = el.instance();
          expect(hasNext).toEqual(false);
          const NextButtonEl = el.find('IconButton').at(1);
          expect(NextButtonEl.prop('disabled')).toEqual(!hasNext);
        });
        test('onNextPageButtonClick', () => {
          const pageNumber = 1;
          el.setState({ pageNumber, ...state });
          const NextButtonEl = el.find('IconButton').at(1);
          NextButtonEl.simulate('click');
          expect(el.state('pageNumber')).toEqual(pageNumber + 1);
        });
      });

      describe('input page change', () => {
        test('onInputPageChange', () => {
          el.setState({ pageNumber: state.numPages, ...state });
          const event = {
            target: {
              value: 5,
            },
          };
          el.find('[type="number"]').simulate('change', event);
          el.instance().onInputPageChange(event);
          expect(el.state('pageNumber')).toEqual(event.target.value);
          expect(el.state('pageNumber')).not.toEqual(state.numPages);
        });
      });
    });
  });
});
