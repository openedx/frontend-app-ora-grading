import React from 'react';
import PropTypes from 'prop-types';

import { Card, Collapsible, Icon } from '@edx/paragon';
import { ArrowDropDown, ArrowDropUp } from '@edx/paragon/icons';
import PreviewPanel from 'components/PreviewPanel';

/**
 * <PreviewDisplay />
 */
/* eslint-disable react/prefer-stateless-function */
export class PreviewDisplay extends React.Component {
  render() {
    const { files } = this.props;
    const supportedFiles = files.filter(file => PreviewPanel.isSupported(file.name));
    if (supportedFiles.length === 0) {
      return null;
    }
    return supportedFiles.map((file) => (
      <Card className="submission-files" key={file.name}>
        <Collapsible.Advanced defaultOpen>
          <Collapsible.Trigger className="submission-files-title">
            <h3>{file.name}</h3>
            <Collapsible.Visible whenClosed>
              <Icon src={ArrowDropDown} />
            </Collapsible.Visible>
            <Collapsible.Visible whenOpen>
              <Icon src={ArrowDropUp} />
            </Collapsible.Visible>
          </Collapsible.Trigger>
          <Collapsible.Body className="submission-files-body">
            <PreviewPanel url={file.downloadUrl} fileName={file.name} />
          </Collapsible.Body>
        </Collapsible.Advanced>
      </Card>
    ));
  }
}

PreviewDisplay.defaultProps = {
  files: [],
};
PreviewDisplay.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadUrl: PropTypes.string,
    }),
  ),
};

export default PreviewDisplay;
