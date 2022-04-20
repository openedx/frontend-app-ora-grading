import React from 'react';

import { MockUseState } from 'testUtils';
import { keyStore } from 'utils';
import { ErrorStatuses } from 'data/constants/requests';

import * as hooks from './pdfHooks';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: () => 'Document',
  Page: () => 'Page',
}));

const state = new MockUseState(hooks);
const hookKeys = keyStore(hooks);

const testValue = 'my-test-value';

describe('PDF Renderer hooks', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  describe('state hooks', () => {
    state.testGetter(state.keys.pageNumber);
    state.testGetter(state.keys.numPages);
    state.testGetter(state.keys.relativeHeight);
  });
  describe('non-state hooks', () => {
    beforeEach(() => state.mock());
    afterEach(() => state.restore());
    describe('safeSetPageNumber', () => {
      it('returns value handler that sets page number if valid', () => {
        const rawSetPageNumber = jest.fn();
        const numPages = 10;
        hooks.safeSetPageNumber({ numPages, rawSetPageNumber })(0);
        expect(rawSetPageNumber).not.toHaveBeenCalled();
        hooks.safeSetPageNumber({ numPages, rawSetPageNumber })(numPages + 1);
        expect(rawSetPageNumber).not.toHaveBeenCalled();
        hooks.safeSetPageNumber({ numPages, rawSetPageNumber })(numPages - 1);
        expect(rawSetPageNumber).toHaveBeenCalledWith(numPages - 1);
      });
    });
    describe('rendererHooks', () => {
      const props = {
        url: 'some_url.pdf',
        onError: jest.fn().mockName('this.props.onError'),
        onSuccess: jest.fn().mockName('this.props.onSuccess'),
      };
      let setPageNumber;
      let hook;
      let mockSetPageNumber;
      let mockSafeSetPageNumber;
      beforeEach(() => {
        mockSetPageNumber = jest.fn(val => ({ setPageNumber: { val } }));
        mockSafeSetPageNumber = jest.fn(() => mockSetPageNumber);
        setPageNumber = jest.spyOn(hooks, hookKeys.safeSetPageNumber)
          .mockImplementation(mockSafeSetPageNumber);
        hook = hooks.rendererHooks(props);
      });
      afterAll(() => {
        setPageNumber.mockRestore();
      });
      describe('returned object', () => {
        Object.keys(state.keys).forEach(key => {
          test(`${key} tied to store and initialized from initialState`, () => {
            expect(hook[key]).toEqual(hooks.initialState[key]);
            expect(hook[key]).toEqual(state.stateVals[key]);
          });
        });
      });
      test('wrapperRef passed as react ref', () => {
        expect(hook.wrapperRef.useRef).toEqual(true);
      });
      describe('onDocumentLoadSuccess', () => {
        it('calls onSuccess and sets numPages based on args', () => {
          hook.onDocumentLoadSuccess({ numPages: testValue });
          expect(props.onSuccess).toHaveBeenCalled();
          expect(state.setState.numPages).toHaveBeenCalledWith(testValue);
        });
      });
      describe('onLoadPageSuccess', () => {
        it('sets relative height based on page size', () => {
          const width = 23;
          React.useRef.mockReturnValueOnce({
            current: {
              getBoundingClientRect: () => ({ width }),
            },
          });
          const [pageWidth, pageHeight] = [20, 30];
          const page = { view: [0, 0, pageWidth, pageHeight] };
          hook = hooks.rendererHooks(props);
          const height = (width * pageHeight) / pageWidth;
          hook.onLoadPageSuccess(page);
          expect(state.setState.relativeHeight).toHaveBeenCalledWith(height);
        });
      });
      describe('onDocumentLoadError', () => {
        it('calls onError with notFound error if error is missingPDF error', () => {
          hook.onDocumentLoadError({ name: hooks.errors.missingPDF });
          expect(props.onError).toHaveBeenCalledWith(ErrorStatuses.notFound);
        });
        it('calls onError with serverError by default', () => {
          hook.onDocumentLoadError({ name: testValue });
          expect(props.onError).toHaveBeenCalledWith(ErrorStatuses.serverError);
        });
      });
      describe('onInputPageChange', () => {
        it('calls setPageNumber with int event target value', () => {
          hook.onInputPageChange({ target: { value: '2.3' } });
          expect(mockSetPageNumber).toHaveBeenCalledWith(2);
        });
      });
      describe('onPrevPageButtonClick', () => {
        it('calls setPageNumber with current page number - 1', () => {
          hook.onPrevPageButtonClick();
          expect(mockSetPageNumber).toHaveBeenCalledWith(hook.pageNumber - 1);
        });
      });
      describe('onNextPageButtonClick', () => {
        it('calls setPageNumber with current page number + 1', () => {
          hook.onNextPageButtonClick();
          expect(mockSetPageNumber).toHaveBeenCalledWith(hook.pageNumber + 1);
        });
      });
      test('hasNext returns true iff pageNumber is less than total number of pages', () => {
        state.mockVal(state.keys.numPages, 10);
        state.mockVal(state.keys.pageNumber, 9);
        hook = hooks.rendererHooks(props);
        expect(hook.hasNext).toEqual(true);
        state.mockVal(state.keys.pageNumber, 10);
        hook = hooks.rendererHooks(props);
        expect(hook.hasNext).toEqual(false);
      });
      test('hasPrev returns true iff pageNumber is greater than 1', () => {
        state.mockVal(state.keys.pageNumber, 1);
        hook = hooks.rendererHooks(props);
        expect(hook.hasPrev).toEqual(false);
        state.mockVal(state.keys.pageNumber, 0);
        hook = hooks.rendererHooks(props);
        expect(hook.hasPrev).toEqual(false);
        state.mockVal(state.keys.pageNumber, 2);
        hook = hooks.rendererHooks(props);
        expect(hook.hasPrev).toEqual(true);
      });
    });
  });
});
