import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from '@edx/paragon';

import createDOMPurify from 'dompurify';

import parse from 'html-react-parser';

import selectors from 'data/selectors';

import SubmissionFiles from './SubmissionFiles';

import './ResponseDisplay.scss';
import PreviewDisplay from './PreviewDisplay';

/**
 * <ResponseDisplay />
 */
export class ResponseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.purify = createDOMPurify(window);
  }

  get textContent() {
    return parse(this.purify.sanitize(this.props.response.text));
  }

  get submittedFiles() {
    return this.props.response.files;
  }

  render() {
    return (
      <div className="response-display">
        <SubmissionFiles files={this.submittedFiles} />
        <PreviewDisplay files={this.submittedFiles} />
        <Card>
          <Card.Body>{this.textContent}</Card.Body>
        </Card>
      </div>
    );
  }
}

ResponseDisplay.defaultProps = {
  response: {
    text: '',
    files: [],
  },
};
ResponseDisplay.propTypes = {
  response: PropTypes.shape({
    text: PropTypes.string,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
      }),
    ).isRequired,
  }),
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
