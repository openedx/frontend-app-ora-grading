import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
} from '@edx/paragon';

import createDOMPurify from 'dompurify';

import parse from 'html-react-parser';

import selectors from 'data/selectors';

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

  get hasResponse() {
    return this.props.response !== undefined;
  }

  render() {
    return (
      <Card className="response-card">
        {this.hasResponse && (
          <Card.Body>
            {this.textContent}
          </Card.Body>
        )}
      </Card>
    );
  }
}

ResponseDisplay.defaultProps = {
};
ResponseDisplay.propTypes = {
  response: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
