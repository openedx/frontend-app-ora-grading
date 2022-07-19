import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from '@edx/paragon';

import createDOMPurify from 'dompurify';

import parse from 'html-react-parser';

import { selectors } from 'data/redux';
import { fileUploadResponseOptions } from 'data/services/lms/constants';

import SubmissionFiles from './SubmissionFiles';
import PreviewDisplay from './PreviewDisplay';

import './ResponseDisplay.scss';

/**
 * <ResponseDisplay />
 */
export class ResponseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.purify = createDOMPurify(window);
  }

  get textContents() {
    return this.props.response.text.map(text => parse(this.purify.sanitize(text)));
  }

  get submittedFiles() {
    return this.props.response.files;
  }

  get allowFileUpload() {
    return (
      this.props.fileUploadResponseConfig !== fileUploadResponseOptions.none
    );
  }

  render() {
    return (
      <div className="response-display">
        {this.allowFileUpload && <SubmissionFiles files={this.submittedFiles} />}
        {this.allowFileUpload && <PreviewDisplay files={this.submittedFiles} />}
        {
          /*  eslint-disable react/no-array-index-key */
          this.textContents.map((textContent, index) => (
            <Card key={index}>
              <Card.Section className="response-display-text-content">{textContent}</Card.Section>
            </Card>
          ))
        }
      </div>
    );
  }
}

ResponseDisplay.defaultProps = {
  response: {
    text: [],
    files: [],
  },
  fileUploadResponseConfig: fileUploadResponseOptions.none,
};
ResponseDisplay.propTypes = {
  response: PropTypes.shape({
    text: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
      }),
    ).isRequired,
  }),
  fileUploadResponseConfig: PropTypes.oneOf(
    Object.values(fileUploadResponseOptions),
  ),
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
  fileUploadResponseConfig: selectors.app.ora.fileUploadResponseConfig(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
