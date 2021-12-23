import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { actions, selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import messages from './messages';

import ReviewError from './ReviewError';

/**
 * <DownloadErrors />
 */
export class DownloadErrors extends React.Component {
  constructor(props) {
    super(props);
    this.cancelAction = this.cancelAction.bind(this);
  }

  cancelAction() {
    this.props.clearState({ requestKey: RequestKeys.downloadFiles });
  }

  render() {
    if (!this.props.isFailed) { return null; }
    return (
      <ReviewError
        key="lockFailed"
        headingMessage={messages.downloadFailedHeading}
        actions={{
          cancel: { onClick: this.cancelAction, message: messages.dismiss },
          confirm: { onClick: this.props.downloadFiles, message: messages.retryDownload },
        }}
      >
        <FormattedMessage {...messages.downloadFailedContent} />
      </ReviewError>
    );
  }
}
DownloadErrors.propTypes = {
  // redux
  clearState: PropTypes.func.isRequired,
  isFailed: PropTypes.bool.isRequired,
  downloadFiles: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.downloadFiles }),
});

export const mapDispatchToProps = {
  clearState: actions.requests.clearRequest,
  downloadFiles: thunkActions.download.downloadFiles,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadErrors);
