import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Collapsible, Icon, DataTable,
} from '@edx/paragon';
import { ArrowDropDown, ArrowDropUp } from '@edx/paragon/icons';

export const HeaderEllipsesCell = ({ value }) => (
  <div className="text-truncate">{value}</div>
);

/**
 * <SubmissionFiles />
 */
export const SubmissionFiles = ({ files }) => {
  const title = `Submission Files (${files.length})`;
  return (
    <Card className="submission-files">
      {files.length ? (
        <Collapsible.Advanced defaultOpen>
          <Collapsible.Trigger className="submission-files-title">
            <h3>{title}</h3>
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
                  Cell: HeaderEllipsesCell,
                },
                {
                  Header: 'Description',
                  accessor: 'description',
                  /* eslint react/prop-types: 0 */
                  Cell: HeaderEllipsesCell,
                },
              ]}
              data={files}
            >
              <DataTable.Table />
            </DataTable>
          </Collapsible.Body>
        </Collapsible.Advanced>
      ) : (
        <div className="submission-files-title no-submissions">
          <h3>{title}</h3>
        </div>
      )}
    </Card>
  );
};

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
