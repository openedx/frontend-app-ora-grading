import React from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import {
  StatefulButton,
} from '@edx/paragon';

/**
 * <FileDownload />
 */
export class FileDownload extends React.Component {
  constructor(props) {
    super(props);
    this.download = this.download.bind(this);
    this.state = {
      actionState: 'default',
    };
  }

  get manifest() {
    const fileManifest = (file) => `Filename: ${file.name}\nDescription: ${file.description}`;
    return this.props.files.map(fileManifest).join('\n\n');
  }

  download() {
    this.setState({ actionState: 'pending' });
    const { files } = this.props;
    const zip = new JSZip();
    const urls = files.map(file => file.downloadUrl);
    const downloadAll = () => Promise.all(
      urls.map(url => fetch(url).then(resp => resp.blob())),
    );
    const generateZip = (blobs) => {
      zip.file('manifest.txt', this.manifest);
      blobs.forEach((blob, i) => {
        zip.file(files[i].name, blob);
      });
      zip.generateAsync({ type: 'blob' }).then(zipFile => {
        const currentDate = new Date().getTime();
        const fileName = `combined-${currentDate}.zip`;
        return FileSaver.saveAs(zipFile, fileName);
      });
    };
    downloadAll().then(generateZip).then(() => this.setState({ actionState: 'complete' }));
  }

  render() {
    return (
      <StatefulButton
        state={this.state.actionState}
        onClick={this.download}
        labels={{
          default: 'Download Files',
          pending: 'Downloading',
          complete: 'Downloaded!',
        }}
        disabledStates={['pending', 'complete']}
      >
        Download
      </StatefulButton>
    );
  }
}

FileDownload.defaultProps = {
  files: [],
};
FileDownload.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadURL: PropTypes.string,
    }),
  ),
};

export default FileDownload;
