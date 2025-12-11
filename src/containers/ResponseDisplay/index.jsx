import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from '@openedx/paragon';

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

  // New getter to extract prompts
  get prompts() {
    const raw = this.props.oraMetadata?.prompts || [];
    return raw.map(p => p.description || '');
  }

  // New helper method
  sanitizeAndParse = (html = '') => parse(this.purify.sanitize(html));

  render() {
    const textResponses = this.textContents || [];
    const { prompts } = this;

    return (
      <div className="response-display">
        {this.allowFileUpload && <SubmissionFiles files={this.submittedFiles} />}
        {this.allowFileUpload && <PreviewDisplay files={this.submittedFiles} />}

        {/* Prompt → Response pairs */}
        {prompts.map((prompt, i) => {
          const answer = textResponses[i] || '';

          return (
            <div key={prompt} className="prompt-response-pair my-5">
              {/* Prompt */}
              <Card className="mb-3">
                <Card.Header title={<strong>Prompt {i + 1}</strong>} />
                <Card.Section className="prompt-text">
                  {this.sanitizeAndParse(prompt)}
                </Card.Section>
              </Card>

              {/* Learner Response */}
              <Card>
                <Card.Header title="Learner Response" />
                <Card.Section className="response-display-text-content">
                  {answer ? (
                    this.sanitizeAndParse(answer)
                  ) : (
                    <em className="text-muted">No response submitted for this prompt.</em>
                  )}
                </Card.Section>
              </Card>
            </div>
          );
        })}

        {/* only shows if no prompts */}
        {prompts.length === 0
        && textResponses.map((text) => (
          <Card key={text} className="my-3">
            <Card.Section>{this.sanitizeAndParse(text)}</Card.Section>
          </Card>
        ))}
      </div>
    );
  }
}

ResponseDisplay.defaultProps = {
  response: {
    text: [],
    files: [],
  },
  // Add default
  oraMetadata: { prompts: [] },
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
  // Add PropTypes
  oraMetadata: PropTypes.shape({
    prompts: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
      }),
    ),
  }),
  fileUploadResponseConfig: PropTypes.oneOf(
    Object.values(fileUploadResponseOptions),
  ),
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
  //  Add oraMetadata + use correct selector
  oraMetadata: selectors.app.oraMetadata(state),
  fileUploadResponseConfig: selectors.app.ora.fileUploadResponseConfig(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
