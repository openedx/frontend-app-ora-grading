import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Collapsible, Icon, DataTable,
} from '@edx/paragon';
import { ArrowDropDown, ArrowDropUp } from '@edx/paragon/icons';

import FileNameCell from './components/FileNameCell';
import FileExtensionCell from './components/FileExtensionCell';
import FilePopoverCell from './components/FilePopoverCell';

/**
 * <SubmissionFiles />
 */
export class SubmissionFiles extends React.Component {
  get title() {
    return `Submission Files (${this.props.files.length})`;
  }

  render() {
    const { files } = this.props;
    return (
      <Card className="submission-files">
        {files.length ? (
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
              <DataTable
                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: FileNameCell,
                  },
                  {
                    Header: 'File Extension',
                    accessor: 'name',
                    id: 'extension',
                    Cell: FileExtensionCell,
                  },
                  {
                    Header: 'Popover',
                    accessor: '',
                    Cell: FilePopoverCell,
                  },
                ]}
                data={files}
                itemCount={files.length}
              >
                <DataTable.Table />
              </DataTable>
            </Collapsible.Body>
          </Collapsible.Advanced>
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
      downloadUrl: PropTypes.string,
    }),
  ),
};

export default SubmissionFiles;
