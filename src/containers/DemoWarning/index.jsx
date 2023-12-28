import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';

import { selectors } from 'data/redux';
import messages from './messages';

/**
 * <DemoWarning />
 */
export const DemoWarning = ({ hide }) => {
  if (hide) { return null; }
  return (
    <Alert
      className="mb-0 rounded-0"
      variant="warning"
      icon={Info}
    >
      <Alert.Heading>
        <FormattedMessage {...messages.demoModeHeading} />
      </Alert.Heading>
      <p><FormattedMessage {...messages.demoModeMessage} /></p>
    </Alert>
  );
};
DemoWarning.propTypes = {
  hide: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  hide: selectors.app.isEnabled(state),
});
export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DemoWarning);
