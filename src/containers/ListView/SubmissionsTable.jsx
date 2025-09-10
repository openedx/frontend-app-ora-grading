import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  DataTable,
  TextFilter,
  MultiSelectDropdownFilter,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { gradingStatuses, submissionFields } from 'data/services/lms/constants';
import lmsMessages from 'data/services/lms/messages';

import { selectors, thunkActions } from 'data/redux';

import StatusBadge from 'components/StatusBadge';
import FilterStatusComponent from './FilterStatusComponent';
import TableAction from './TableAction';
import SelectedBulkAction from './SelectedBulkAction';

import messages from './messages';

/**
 * <SubmissionsTable />
 */
export const SubmissionsTable = ({
  isIndividual,
  listData,
  loadSelectionForReview,
}) => {
  const intl = useIntl();

  const translate = (...args) => intl.formatMessage(...args);

  const gradeStatusOptions = Object.keys(gradingStatuses).map(statusKey => ({
    name: translate(lmsMessages[gradingStatuses[statusKey]]),
    value: gradingStatuses[statusKey],
  }));

  const userLabel = translate(isIndividual ? messages.username : messages.teamName);

  const userAccessor = isIndividual
    ? submissionFields.username
    : submissionFields.teamName;

  const dateSubmittedLabel = translate(isIndividual
    ? messages.learnerSubmissionDate
    : messages.teamSubmissionDate);

  const formatDate = ({ value }) => {
    const date = new Date(moment(value));
    return date.toLocaleString();
  };

  const formatGrade = ({ value: score }) => (
    score === null ? '-' : `${score.pointsEarned}/${score.pointsPossible}`
  );

  const formatStatus = ({ value }) => (<StatusBadge status={value} />);

  const handleViewAllResponsesClick = (data) => () => {
    const getSubmissionUUID = (row) => row.original.submissionUUID;
    loadSelectionForReview(data.map(getSubmissionUUID));
  };

  if (!listData.length) {
    return null;
  }

  return (
    <div className="submissions-table">
      <DataTable
        data-testid="data-table"
        isFilterable
        FilterStatusComponent={FilterStatusComponent}
        numBreakoutFilters={2}
        defaultColumnValues={{ Filter: TextFilter }}
        isSelectable
        isSortable
        isPaginated
        itemCount={listData.length}
        initialState={{ pageSize: 10, pageIndex: 0 }}
        data={listData}
        tableActions={[
          <TableAction handleClick={handleViewAllResponsesClick} />,
        ]}
        bulkActions={[
          <SelectedBulkAction handleClick={handleViewAllResponsesClick} />,
        ]}
        columns={[
          {
            Header: userLabel,
            accessor: userAccessor,
          },
          {
            Header: dateSubmittedLabel,
            accessor: submissionFields.dateSubmitted,
            Cell: formatDate,
            disableFilters: true,
          },
          {
            Header: translate(messages.grade),
            accessor: submissionFields.score,
            Cell: formatGrade,
            disableFilters: true,
          },
          {
            Header: translate(messages.gradingStatus),
            accessor: submissionFields.gradingStatus,
            Cell: formatStatus,
            Filter: MultiSelectDropdownFilter,
            filter: 'includesValue',
            filterChoices: gradeStatusOptions,
          },
        ]}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.TableFooter />
      </DataTable>
    </div>
  );
};
SubmissionsTable.defaultProps = {
  listData: [],
};
SubmissionsTable.propTypes = {
  // redux
  isIndividual: PropTypes.bool.isRequired,
  listData: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    dateSubmitted: PropTypes.string,
    gradingStatus: PropTypes.string,
    score: PropTypes.shape({
      pointsEarned: PropTypes.number,
      pointsPossible: PropTypes.number,
    }),
  })),
  loadSelectionForReview: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  listData: selectors.submissions.listData(state),
  isIndividual: selectors.app.ora.isIndividual(state),
});

export const mapDispatchToProps = {
  loadSelectionForReview: thunkActions.grading.loadSelectionForReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsTable);
