import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Collapsible, Icon, DataTable, Button,
} from '@edx/paragon';
import { ArrowDropDown, ArrowDropUp, WarningFilled } from '@edx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { downloadAllLimit, downloadSingleLimit } from 'data/constants/files';

import FileNameCell from './components/FileNameCell';
import FileExtensionCell from './components/FileExtensionCell';
import FilePopoverCell from './components/FilePopoverCell';
import FileDownload from './FileDownload';

import messages from './messages';

/**
 * <SubmissionFiles />
 */
export class SubmissionFiles extends React.Component {
  get title() {
    return `${this.props.intl.formatMessage(messages.submissionFiles)} (${this.props.files.length})`;
  }

  get canDownload() {
    let totalFileSize = 0;
    const exceedFileSize = this.props.files.some(file => {
      totalFileSize += file.size;
      return file.size > downloadSingleLimit;
    });

    return !exceedFileSize && totalFileSize < downloadAllLimit;
  }

  render() {
    const { files, intl } = this.props;
    return (
      <Card className="submission-files">
        {files.length ? (
          <>
            <Collapsible.Advanced defaultOpen>
              <Collapsible.Trigger className="submission-files-title">
                <h3>{this.title}</h3>
                <Collapsible.Visible whenClosed>
                  <Icon src={ArrowDropDown} />
                </Collapsible.Visible>
                <Collapsible.Visible whenOpen>
                  <Icon src={ArrowDropUp} />
                </Collapsible.Visible>
              </Collapsible.Trigger>
              <Collapsible.Body className="submission-files-body">
                <div className="submission-files-table">
                  <DataTable
                    columns={[
                      {
                        Header: intl.formatMessage(messages.tableNameHeader),
                        accessor: 'name',
                        Cell: FileNameCell,
                      },
                      {
                        Header: intl.formatMessage(
                          messages.tableExtensionHeader,
                        ),
                        accessor: 'name',
                        id: 'extension',
                        Cell: FileExtensionCell,
                      },
                      {
                        Header: intl.formatMessage(messages.tablePopoverHeader),
                        accessor: '',
                        Cell: FilePopoverCell,
                      },
                    ]}
                    data={files}
                    itemCount={files.length}
                  >
                    <DataTable.Table />
                  </DataTable>
                </div>
              </Collapsible.Body>
            </Collapsible.Advanced>
            <Card.Footer className="text-right">
              {
                this.canDownload ? <FileDownload files={files} /> : (
                  <div>
                    <Icon className="d-inline-block align-middle" src={WarningFilled} />
                    <span className="exceed-download-text"> {intl.formatMessage(messages.exceedFileSize)} </span>
                    <Button disabled>{intl.formatMessage(messages.downloadFiles)}</Button>
                  </div>
                )
              }
            </Card.Footer>
          </>
        ) : (
          <div className="submission-files-title no-submissions">
            <h3>{this.title}</h3>
          </div>
        )}
      </Card>
    );
  }
}

SubmissionFiles.defaultProps = {
  files: [],
};
SubmissionFiles.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadURL: PropTypes.string,
    }),
  ),
  intl: intlShape.isRequired,
};

export default injectIntl(SubmissionFiles);
