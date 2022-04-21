import { useState, useRef } from 'react';

import { pdfjs } from 'react-pdf';
import pdfjsWorker from 'react-pdf/dist/esm/pdf.worker.entry';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { ErrorStatuses } from 'data/constants/requests';
import { StrictDict } from 'utils';
import * as module from './pdfHooks';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const errors = StrictDict({
  missingPDF: 'MissingPDFException',
});

export const state = StrictDict({
  pageNumber: (val) => useState(val),
  numPages: (val) => useState(val),
  relativeHeight: (val) => useState(val),
});

export const initialState = {
  pageNumber: 1,
  numPages: 1,
  relativeHeight: 1,
};

export const safeSetPageNumber = ({ numPages, rawSetPageNumber }) => (pageNumber) => {
  if (pageNumber > 0 && pageNumber <= numPages) {
    rawSetPageNumber(pageNumber);
  }
};

export const rendererHooks = ({
  onError,
  onSuccess,
}) => {
  const [pageNumber, rawSetPageNumber] = module.state.pageNumber(initialState.pageNumber);
  const [numPages, setNumPages] = module.state.numPages(initialState.numPages);
  const [relativeHeight, setRelativeHeight] = module.state.relativeHeight(
    initialState.relativeHeight,
  );

  const setPageNumber = module.safeSetPageNumber({ numPages, rawSetPageNumber });

  const wrapperRef = useRef();

  return {
    pageNumber,
    numPages,
    relativeHeight,
    wrapperRef,
    onDocumentLoadSuccess: (args) => {
      onSuccess();
      setNumPages(args.numPages);
    },
    onLoadPageSuccess: (page) => {
      const pageWidth = page.view[2];
      const pageHeight = page.view[3];
      const wrapperHeight = wrapperRef.current.getBoundingClientRect().width;
      const newHeight = (wrapperHeight * pageHeight) / pageWidth;
      setRelativeHeight(newHeight);
    },
    onDocumentLoadError: (error) => {
      let status;
      if (error.name === errors.missingPDF) {
        status = ErrorStatuses.notFound;
      } else {
        status = ErrorStatuses.serverError;
      }
      onError(status);
    },
    onInputPageChange: ({ target: { value } }) => setPageNumber(parseInt(value, 10)),
    onPrevPageButtonClick: () => setPageNumber(pageNumber - 1),
    onNextPageButtonClick: () => setPageNumber(pageNumber + 1),
    hasNext: pageNumber < numPages,
    hasPrev: pageNumber > 1,
  };
};
