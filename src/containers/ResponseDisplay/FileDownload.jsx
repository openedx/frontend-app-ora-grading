import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import {
  StatefulButton,
  Icon,
} from '@edx/paragon';

import { RequestKeys, RequestStates } from 'data/constants/requests';
import { selectors, thunkActions } from 'data/redux';
import messages from './messages';

export const statusMapping = {
  [RequestStates.inactive]: 'default',
  [RequestStates.pending]: 'pending',
  [RequestStates.completed]: 'completed',
  [RequestStates.failed]: 'failed',
};
/**
 * <FileDownload />
 */
export const FileDownload = ({ requestStatus, downloadFiles }) => (
  <StatefulButton
    state={statusMapping[requestStatus.status]}
    onClick={downloadFiles}
    icons={{
      default: <Icon className="fa fa-download" />,
      pending: <Icon className="fa fa-spinner fa-spin" />,
      complete: <Icon className="fa fa-check" />,
      failed: <Icon className="fa fa-refresh" />,
    }}
    labels={{
      default: <FormattedMessage {...messages.downloadFiles} />,
      pending: <FormattedMessage {...messages.downloading} />,
      complete: <FormattedMessage {...messages.downloaded} />,
      failed: <FormattedMessage {...messages.retryDownload} />,
    }}
    disabledStates={['pending', 'complete']}
  />
);

FileDownload.defaultProps = {
};
FileDownload.propTypes = {
  downloadFiles: PropTypes.func.isRequired,
  requestStatus: PropTypes.shape({ status: PropTypes.string }).isRequired,
};

export const mapStateToProps = (state) => ({
  requestStatus: selectors.requests.requestStatus(state, { requestKey: RequestKeys.downloadFiles }),
});
export const mapDispatchToProps = {
  downloadFiles: thunkActions.download.downloadFiles,
};

export default connect(mapStateToProps, mapDispatchToProps)(FileDownload);
