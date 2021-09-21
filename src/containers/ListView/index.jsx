import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Badge,
  DataTable,
  TextFilter,
} from '@edx/paragon';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import StatusBadge from 'components/StatusBadge';
import ReviewModal from 'containers/ReviewModal';
import './ListView.scss';

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
            },
            {
              Header: 'Grade',
              accessor: 'score',
              Cell: this.formatGrade,
            },
            {
              Header: 'Grading Status',
              accessor: 'gradeStatus',
              Cell: this.formatStatus,
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
    gradeStatus: PropTypes.string,
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
