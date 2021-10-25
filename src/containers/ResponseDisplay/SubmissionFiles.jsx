import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  Collapsible,
  Button,
  Icon,
  DataTable,
  IconButton,
} from '@edx/paragon';
import { Download, ArrowDropDown, ArrowDropUp } from '@edx/paragon/icons';

/**
 * <SubmissionFiles />
 */

export const SubmissionFiles = ({ files }) => (
  <Card className='submission-files'>
    {files.length ? (
      <Collapsible.Advanced defaultOpen>
        <Collapsible.Trigger className='submission-files-title'>
          <h3>Attached Files ({files.length})</h3>
          <Collapsible.Visible whenClosed>
            <Icon src={ArrowDropDown} />
          </Collapsible.Visible>
          <Collapsible.Visible whenOpen>
            <Icon src={ArrowDropUp} />
          </Collapsible.Visible>
        </Collapsible.Trigger>

        <Collapsible.Body className='submission-files-body'>
          <DataTable
            columns={[
              {
                Header: 'Name',
                accessor: 'name',
                Cell: ({ value }) => (
                  <div className='text-truncate'>{value}</div>
                ),
              },
              {
                Header: 'Description',
                accessor: 'description',
                Cell: ({ value }) => (
                  <div className='text-truncate'>{value}</div>
                ),
              },
              {
                Header: 'Download',
                accessor: 'downloadUrl',
                Cell: ({ value }) => (
                  <IconButton
                    src={Download}
                    iconAs={Icon}
                    alt='Download'
                    onClick={() => {
                      console.log(value);
                    }}
                  />
                ),
              },
            ]}
            data={files}
          >
            <DataTable.Table />
          </DataTable>
        </Collapsible.Body>
        <div className='submission-files-footer'>
          <Button>
            Download Files <Icon src={Download} />
          </Button>
        </div>
      </Collapsible.Advanced>
    ) : (
      <div className='submission-files-title disabled'>
        <h3>No Attached Files Founded</h3>
      </div>
    )}
  </Card>
);

SubmissionFiles.defaultProps = {
  files: [],
};
SubmissionFiles.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      downloadUrl: PropTypes.string,
    })
  ).isRequired,
};

export default SubmissionFiles;
