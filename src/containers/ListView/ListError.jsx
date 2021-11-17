import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Alert,
  Button,
  Hyperlink,
} from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import urls from 'data/services/lms/urls';

import { selectors } from 'data/redux';

import messages from './messages';

/**
 * <ListError />
 */
export const ListError = ({ courseId }) => (
  <Alert
    variant="danger"
    icon={Info}
    actions={[
      <Button>Reload Submissions</Button>,
    ]}
  >
    <Alert.Heading>
      <FormattedMessage {...messages.loadErrorHeading} />
    </Alert.Heading>
    <p>
      <FormattedMessage
        {...messages.loadErrorMessage}
        values={{
          backToResponses: (
            <Hyperlink destination={urls.openResponse(courseId)}>
              <FormattedMessage {...messages.backToResponsesLowercase} />
            </Hyperlink>
          ),
        }}
      />
    </p>
  </Alert>
);
ListError.defaultProps = {
};
ListError.propTypes = {
  // redux
  courseId: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  courseId: selectors.app.courseId(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListError);
