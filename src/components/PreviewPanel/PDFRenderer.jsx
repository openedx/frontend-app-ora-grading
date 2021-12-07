import React from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // avoid import worker directly

import {
  Icon, Form, ActionRow, IconButton,
} from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';

/**
 * <PDFRenderer />
 */
export class PDFRenderer extends React.Component {
  static supportedTypes = ['pdf'];

  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1,
      numPages: 1,
      relativeHeight: 0,
    };

    this.wrapperRef = React.createRef();
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.onDocumentLoadError = this.onDocumentLoadError.bind(this);
    this.onLoadPageSuccess = this.onLoadPageSuccess.bind(this);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  onLoadPageSuccess = (page) => {
    // 686 * 1078 / 1862
    const pageWidth = page.view[2];
    const pageHeight = page.view[3];
    const wrapperHeight = this.wrapperRef.current.getBoundingClientRect().width;
    const relativeHeight = (wrapperHeight * pageHeight) / pageWidth;
    if (relativeHeight !== this.state.relativeHeight) {
      this.setState({ relativeHeight });
    }
  };

  onDocumentLoadError = (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  };

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
            onClick={() => this.setPageNumber(this.state.pageNumber - 1)}
          />
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Label isInline>Page </Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={this.state.numPages}
              value={this.state.pageNumber}
              onChange={(e) => this.setPageNumber(parseInt(e.target.value, 10))}
            />
            <Form.Label isInline> of {this.state.numPages}</Form.Label>
          </Form.Group>
          <IconButton
            size="inline"
            alt="next pdf page"
            iconAs={Icon}
            src={ChevronRight}
            disabled={!this.hasNext}
            onClick={() => this.setPageNumber(this.state.pageNumber + 1)}
          />
        </ActionRow>
      </div>
    );
  }
}

PDFRenderer.defaultProps = {};

PDFRenderer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default PDFRenderer;
