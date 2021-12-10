import React from 'react';
import { shallow } from 'enzyme';

import { Document, Page } from 'react-pdf';
import { Form, IconButton } from '@edx/paragon';

import PDFRenderer from './PDFRenderer';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: () => 'Document',
  Page: () => 'Page',
}));

describe('PDF Renderer Component', () => {
  const props = {
    url: 'some_url.pdf',
  };

  let el;
  describe('snapshots', () => {
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
  });

  describe('Component', () => {
    const numPages = 99;
    const pageNumber = 234;
    const supportedTypes = ['pdf'];
    beforeEach(() => {
      el = shallow(<PDFRenderer {...props} />);
    });
    describe('render', () => {
      describe('Top-level document', () => {
        let documentEl;
        beforeEach(() => { documentEl = el.find(Document); });
        it('displays file from props.url', () => {
          expect(documentEl.props().file).toEqual(props.url);
        });
        it('calls this.onDocumentLoadSuccess onLoadSuccess', () => {
          expect(documentEl.props().onLoadSuccess).toEqual(el.instance().onDocumentLoadSuccess);
        });
        it('calls this.onDocumentLoadError onLoadError', () => {
          expect(documentEl.props().onLoadError).toEqual(el.instance().onDocumentLoadError);
        });
      });
      describe('Page', () => {
        let pageProps;
        beforeEach(() => {
          el.instance().setState({ pageNumber });
          pageProps = el.find(Page).props();
        });
        it('loads pageNumber from state', () => {
          expect(pageProps.pageNumber).toEqual(pageNumber);
        });
        it('calls onLoadPageSuccess onLoadSuccess', () => {
          expect(pageProps.onLoadSuccess).toEqual(el.instance().onLoadPageSuccess);
        });
      });
      describe('pagination ActionRow', () => {
        describe('Previous page button', () => {
          let hasPrev;
          beforeEach(() => {
            hasPrev = jest.spyOn(el.instance(), 'hasPrev', 'get').mockReturnValue(false);
          });
          const btn = () => shallow(el.instance().render()).find(IconButton).at(0).props();
          test('disabled iff not this.hasPrev', () => {
            expect(btn().disabled).toEqual(true);
            hasPrev.mockReturnValue(true);
            expect(btn().disabled).toEqual(false);
          });
          it('calls onPrevPageButtonClick onClick', () => {
            expect(btn().onClick).toEqual(el.instance().onPrevPageButtonClick);
          });
        });
        describe('page indicator', () => {
          const control = () => el.find(Form.Control).at(0).props();
          const labels = () => {
            const flat = el.find({ isInline: true });
            return [0, 1].map(i => flat.at(i).text());
          };
          beforeEach(() => { el.instance().setState({ numPages, pageNumber }); });
          test('labels: Page <state.pageNumber> of <state.numPages>', () => {
            expect(`${labels()[0]}${control().value}${labels()[1]}`).toEqual(
              `Page ${pageNumber} of ${numPages}`,
            );
          });
          it('loads max from state.numPages', () => expect(control().max).toEqual(numPages));
          it('loads value from state.pageNumber', () => {
            expect(control().value).toEqual(pageNumber);
          });
          it('calls onInputPageChange onChange', () => {
            expect(control().onChange).toEqual(el.instance().onInputPageChange);
          });
        });
        describe('Next page button', () => {
          let hasNext;
          beforeEach(() => {
            hasNext = jest.spyOn(el.instance(), 'hasNext', 'get').mockReturnValue(false);
          });
          const btn = () => shallow(el.instance().render()).find(IconButton).at(1).props();
          test('disabled iff not this.hasNext', () => {
            expect(btn().disabled).toEqual(true);
            hasNext.mockReturnValue(true);
            expect(btn().disabled).toEqual(false);
          });
          it('calls onNextPageButtonClick onClick', () => {
            expect(btn().onClick).toEqual(el.instance().onNextPageButtonClick);
          });
        });
      });
    });
    test('static supported types is expected', () => {
      expect(PDFRenderer.supportedTypes).toEqual(supportedTypes);
    });

    describe('behavior', () => {
      test('initial state', () => {
        expect(el.instance().state).toEqual(PDFRenderer.INITIAL_STATE);
      });
      describe('onDocumentLoadSuccess', () => {
        test('loads numPages into state', () => {
          el.instance().onDocumentLoadSuccess({ numPages });
          expect(el.instance().state.numPages).toEqual(numPages);
        });
      });
      describe('onLoadPageSuccess', () => {
        const [pageHeight, pageWidth] = [23, 34];
        const page = { view: [1, 2, pageWidth, pageHeight] };
        const wrapperWidth = 20;
        const expected = (wrapperWidth * pageHeight) / pageWidth;
        beforeEach(() => {
          el.instance().wrapperRef = {
            current: {
              getBoundingClientRect: () => ({ width: wrapperWidth }),
            },
          };
        });
        it('sets relative height if it has changes', () => {
          el.instance().onLoadPageSuccess(page);
          expect(el.instance().state.relativeHeight).toEqual(expected);
        });
        it('does not try to set height if has not changes', () => {
          el.instance().setState({ relativeHeight: expected });
          el.instance().setState = jest.fn();
          el.instance().onLoadPageSuccess(page);
          expect(el.instance().setState).not.toHaveBeenCalled();
        });
      });
      describe('setPageNumber inheritors', () => {
        beforeEach(() => {
          el.instance().setPageNumber = jest.fn();
          el.instance().setState({ pageNumber });
        });
        describe('onInputChange', () => {
          it('calls setPageNumber with int value of event target value', () => {
            el.instance().onInputPageChange({ target: { value: '23' } });
            expect(el.instance().setPageNumber).toHaveBeenCalledWith(23);
          });
        });
        describe('onPrevPageButtonClick', () => {
          it('calls setPageNumber with state.pageNumber - 1', () => {
            el.instance().onPrevPageButtonClick();
            expect(el.instance().setPageNumber).toHaveBeenCalledWith(pageNumber - 1);
          });
        });
        describe('onNextPageButtonClick', () => {
          it('calls setPageNumber with state.pageNumber + 1', () => {
            el.instance().onNextPageButtonClick();
            expect(el.instance().setPageNumber).toHaveBeenCalledWith(pageNumber + 1);
          });
        });
      });
      describe('setPageNumber', () => {
        it('calls setState with pageNumber iff valid', () => {
          el.instance().setState({ numPages });
          const setState = jest.spyOn(el.instance(), 'setState');
          el.instance().setPageNumber(0);
          expect(setState).not.toHaveBeenCalled();
          el.instance().setPageNumber(numPages + 1);
          expect(setState).not.toHaveBeenCalled();
          el.instance().setPageNumber(2);
          expect(setState).toHaveBeenCalledWith({ pageNumber: 2 });
        });
      });
      describe('hasNext getter', () => {
        it('returns true iff state.pageNumber < state.numPages', () => {
          el.instance().setState({ pageNumber: 1, numPages: 1 });
          expect(el.instance().hasNext).toEqual(false);
          el.instance().setState({ pageNumber: 1, numPages: 2 });
          expect(el.instance().hasNext).toEqual(true);
        });
      });
      describe('hasPrev getter', () => {
        it('returns true iff state.pageNumber > 1', () => {
          el.instance().setState({ pageNumber: 1 });
          expect(el.instance().hasPrev).toEqual(false);
          el.instance().setState({ pageNumber: 2 });
          expect(el.instance().hasPrev).toEqual(true);
        });
      });
    });
    test('static supported types is expected', () => {
      expect(PDFRenderer.supportedTypes).toEqual(supportedTypes);
    });
  });
});
