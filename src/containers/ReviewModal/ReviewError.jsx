import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Alert,
  Button,
} from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { thunkActions } from 'data/redux';

import messages from './messages';

/**
 * <ReviewError />
 */
export const ReviewError = ({ reload }) => (
  <Alert
    variant="danger"
    icon={Info}
    actions={[
      <Button onClick={reload}>
        <FormattedMessage {...messages.reloadSubmission} />
      </Button>,
    ]}
  >
    <Alert.Heading>
      <FormattedMessage {...messages.loadErrorHeading} />
    </Alert.Heading>
    <p>
      <FormattedMessage {...messages.loadErrorMessage} />
    </p>
  </Alert>
);
ReviewError.defaultProps = {
};
ReviewError.propTypes = {
  // redux
  reload: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({
});

export const mapDispatchToProps = {
  reload: thunkActions.grading.loadSubmission,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewError);
