import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card } from '@openedx/paragon';

import createDOMPurify from 'dompurify';

import parse from 'html-react-parser';

import { selectors } from 'data/redux';
import { fileUploadResponseOptions } from 'data/services/lms/constants';

import { getConfig } from '@edx/frontend-platform';
import SubmissionFiles from './SubmissionFiles';
import PreviewDisplay from './PreviewDisplay';
import { SinglePromptDisplay, MultiplePromptDisplay } from './PromptDisplay';
import './ResponseDisplay.scss';

/**
 * <ResponseDisplay />
 */
export class ResponseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.purify = createDOMPurify(window);
  }

  get prompts() {
    return this.props.prompts.map((item) => this.formattedHtml(item));
  }

  get textContents() {
    const { text } = this.props.response;
    const formattedText = text.map((item) => this.formattedHtml(item));
    return formattedText;
  }

  get submittedFiles() {
    return this.props.response.files;
  }

  get allowFileUpload() {
    return (
      this.props.fileUploadResponseConfig !== fileUploadResponseOptions.none
    );
  }

  formattedHtml(text) {
    const cleanedText = text.replaceAll(/\.\.\/asset/g, `${getConfig().LMS_BASE_URL}/asset`);
    return parse(this.purify.sanitize(cleanedText));
  }

  render() {
    const { prompts } = this;
    const multiPrompt = prompts.length > 1;
    return (
      <div className="response-display">
        {!multiPrompt && <SinglePromptDisplay prompt={prompts[0]} />}
        {this.allowFileUpload && <SubmissionFiles files={this.submittedFiles} data-testid="submission-files" />}
        {this.allowFileUpload && <PreviewDisplay files={this.submittedFiles} data-testid="allow-file-upload" />}
        {
          /*  eslint-disable react/no-array-index-key */
          this.textContents.map((textContent, index) => (
            <Card className="response-display-card" key={index}>
              {multiPrompt && <MultiplePromptDisplay prompt={prompts[index]} />}
              <Card.Section className="response-display-text-content" data-testid="response-display-text-content">{textContent}</Card.Section>
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
  prompts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
  fileUploadResponseConfig: selectors.app.ora.fileUploadResponseConfig(state),
  prompts: selectors.app.ora.prompts(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
