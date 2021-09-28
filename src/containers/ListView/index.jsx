import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  DataTable,
  TextFilter,
  MultiSelectDropdownFilter,
} from '@edx/paragon';

import {
  gradingStatusDisplay,
} from 'data/services/lms/constants';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import StatusBadge from 'components/StatusBadge';
import ReviewModal from 'containers/ReviewModal';
import './ListView.scss';

const gradeStatusOptions = Object.keys(gradingStatusDisplay).map(key => ({
  name: gradingStatusDisplay[key],
  value: key
}));

/**
 * <ListView />
 */
export class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.props.initializeApp();
    this.handleViewAllResponsesClick = this.handleViewAllResponsesClick.bind(this);
  }

  formatDate = ({ value }) => {
    const date = new Date(value);
    return date.toLocaleString();
  }

  formatGrade = ({ value: grade }) => (
    grade === null ? '-' : `${grade.pointsEarned}/${grade.pointsPossible}`
  );

  formatStatus = ({ value }) => (<StatusBadge status={value} />);

  handleViewAllResponsesClick(data) {
    const getSubmissionId = (row) => row.original.submissionId;
    const rows = data.selectedRows.length ? data.selectedRows : data.tableInstance.rows;
    this.props.loadSelectionForReview(rows.map(getSubmissionId));
  }

  render() {
    // hide if submissions are not loaded.
    if (this.props.listData.length === 0) {
      return null;
    }

    return (
      <div id="ora-esg-list-view">
        <DataTable
          isFilterable
          numBreakoutFilters={2}
          defaultColumnValues={{ Filter: TextFilter }}
          isSelectable
          isSortable
          isPaginated
          itemCount={this.props.listData.length}
          initialState={{ pageSize: 10, pageIndex: 0 }}
          data={this.props.listData}
          tableActions={[
            {
              buttonText: 'View all responses',
              handleClick: this.handleViewAllResponsesClick,
              variant: 'primary',
            },
          ]}
          bulkActions={[
            {
              buttonText: 'View selected responses',
              handleClick: this.handleViewAllResponsesClick,
              variant: 'primary',
            },
          ]}
          columns={[
            {
              Header: 'Username',
              accessor: 'username',
            },
            {
              Header: 'Learner submission date',
              accessor: 'dateSubmitted',
              Cell: this.formatDate,
              disableFilters: true,
            },
            {
              Header: 'Grade',
              accessor: 'score',
              Cell: this.formatGrade,
              disableFilters: true,
            },
            {
              Header: 'Grading Status',
              accessor: 'gradingStatus',
              Cell: this.formatStatus,
              Filter: MultiSelectDropdownFilter,
              filter: 'includesValue',
              filterChoices: gradeStatusOptions,
            },
          ]}
        >
          <DataTable.TableControlBar />
          <DataTable.Table />
          <DataTable.EmptyTable content="No results found" />
          <DataTable.TableFooter />
        </DataTable>
        <ReviewModal />
      </div>
    );
  }
}
ListView.defaultProps = {
  listData: [],
};
ListView.propTypes = {
  initializeApp: PropTypes.func.isRequired,
  listData: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    dateSubmitted: PropTypes.number,
    gradingStatus: PropTypes.string,
    grade: PropTypes.shape({
      pointsEarned: PropTypes.number,
      pointsPossible: PropTypes.number,
    }),
  })),
  loadSelectionForReview: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  listData: selectors.submissions.listData(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
  loadSelectionForReview: thunkActions.grading.loadSelectionForReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
