import React from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // avoid import worker directly

import {
  Icon,
  Form,
  ActionRow,
  IconButton,
} from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';

/**
 * <PreviewPanel />
 */
export class PreviewPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 1,
      numPages: 1,
    };

    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
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
      <div>
        <Document file={this.props.src} onLoadSuccess={this.onDocumentLoadSuccess}>
          {/* <Outline /> */}
          <Page pageNumber={this.state.pageNumber} />
        </Document>
        <ActionRow className="d-flex align-items-center m-0">
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

PreviewPanel.defaultProps = {};

PreviewPanel.propTypes = {
  src: PropTypes.string.isRequired,
};

export default PreviewPanel;
