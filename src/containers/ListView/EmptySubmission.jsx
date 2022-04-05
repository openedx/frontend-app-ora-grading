import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Hyperlink, Button } from '@edx/paragon';

import urls from 'data/services/lms/urls';
import emptyStateSVG from './assets/empty-state.svg';
import messages from './messages';

const EmptySubmission = ({ courseId }) => (
  <div className="empty-submission">
    <img src={emptyStateSVG} alt="empty state" />
    <h3>
      <FormattedMessage {...messages.noResultsFoundTitle} />
    </h3>
    <p>
      <FormattedMessage {...messages.noResultsFoundBody} />
    </p>
    <Hyperlink className="py-4" destination={urls.openResponse(courseId)}>
      <Button variant="outline-primary">
        <FormattedMessage {...messages.backToResponses} />
      </Button>
    </Hyperlink>
  </div>
);

EmptySubmission.defaultProps = {
};
EmptySubmission.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default EmptySubmission;
