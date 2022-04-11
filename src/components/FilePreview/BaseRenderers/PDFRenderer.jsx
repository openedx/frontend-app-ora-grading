import React from 'react';
import PropTypes from 'prop-types';

import { pdfjs, Document, Page } from 'react-pdf';
import {
  Icon, Form, ActionRow, IconButton,
} from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';
import pdfjsWorker from 'react-pdf/dist/esm/pdf.worker.entry';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * <PDFRenderer />
 */
export class PDFRenderer extends React.Component {
  static INITIAL_STATE = {
    pageNumber: 1,
    numPages: 1,
    relativeHeight: 0,
  };

  constructor(props) {
    super(props);

    this.state = { ...PDFRenderer.INITIAL_STATE };

    this.wrapperRef = React.createRef();
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.onDocumentLoadError = this.onDocumentLoadError.bind(this);
    this.onLoadPageSuccess = this.onLoadPageSuccess.bind(this);
    this.onPrevPageButtonClick = this.onPrevPageButtonClick.bind(this);
    this.onNextPageButtonClick = this.onNextPageButtonClick.bind(this);
    this.onInputPageChange = this.onInputPageChange.bind(this);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.props.onSuccess();
    this.setState({ numPages });
  };

  onLoadPageSuccess = (page) => {
    const pageWidth = page.view[2];
    const pageHeight = page.view[3];
    const wrapperHeight = this.wrapperRef.current.getBoundingClientRect().width;
    const relativeHeight = (wrapperHeight * pageHeight) / pageWidth;
    if (relativeHeight !== this.state.relativeHeight) {
      this.setState({ relativeHeight });
    }
  };

  onDocumentLoadError = (error) => {
    let status;
    switch (error.name) {
      case 'MissingPDFException':
        status = 404;
        break;
      default:
        status = 500;
        break;
    }
    this.props.onError(status);
  };

  onInputPageChange = ({ target: { value } }) => {
    this.setPageNumber(parseInt(value, 10));
  }

  onPrevPageButtonClick = () => {
    this.setPageNumber(this.state.pageNumber - 1);
  }

  onNextPageButtonClick = () => {
    this.setPageNumber(this.state.pageNumber + 1);
  }

  setPageNumber(pageNumber) {
    if (pageNumber > 0 && pageNumber <= this.state.numPages) {
      this.setState({ pageNumber });
    }
  }

  get hasNext() {
    return this.state.pageNumber < this.state.numPages;
  }

  get hasPrev() {
    return this.state.pageNumber > 1;
  }

  render() {
    return (
      <div ref={this.wrapperRef} className="pdf-renderer">
        <Document
          file={this.props.url}
          onLoadSuccess={this.onDocumentLoadSuccess}
          onLoadError={this.onDocumentLoadError}
        >
          {/* <Outline /> */}
          <div
            className="page-wrapper"
            style={{
              height: this.state.relativeHeight,
            }}
          >
            <Page
              pageNumber={this.state.pageNumber}
              onLoadSuccess={this.onLoadPageSuccess}
            />
          </div>
        </Document>
        <ActionRow className="d-flex justify-content-center m-0">
          <IconButton
            size="inline"
            alt="previous pdf page"
            iconAs={Icon}
            src={ChevronLeft}
            disabled={!this.hasPrev}
            onClick={this.onPrevPageButtonClick}
          />
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Label isInline>Page </Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={this.state.numPages}
              value={this.state.pageNumber}
              onChange={this.onInputPageChange}
            />
            <Form.Label isInline> of {this.state.numPages}</Form.Label>
          </Form.Group>
          <IconButton
            size="inline"
            alt="next pdf page"
            iconAs={Icon}
            src={ChevronRight}
            disabled={!this.hasNext}
            onClick={this.onNextPageButtonClick}
          />
        </ActionRow>
      </div>
    );
  }
}

PDFRenderer.defaultProps = {};

PDFRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default PDFRenderer;
