import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Badge,
  DataTable,
  TextFilter,
} from '@edx/paragon';

import { gradingStatuses as statuses } from 'data/services/lms/constants';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';

import StatusBadge from './StatusBadge';
import ReviewModal from './ReviewModal';
import './ListView.scss';

const selectColumn = {
  id: 'selection',
  Header: DataTable.ControlledSelectHeader,
  Cell: DataTable.ControlledSelect,
  displaySortBy: true,
};

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

  formatGrade = ({ value }) => (
    value === null ? '-' : value
  );

  formatStatus = ({ value }) => (<StatusBadge status={value} />);

  handleViewAllResponsesClick(data) {
    console.log("View all responses button clicked");
    console.log(data);
    if (data.selectedRows.length) {
      this.props.loadSelectionForReview(data.selectedRows);
    }
    else {
      this.props.loadSelectionForReview(data.tableInstance.rows);
    }
  }

  render() {
    console.log({ props: this.props, length: this.props.listData.length });
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
              accessor: 'grade',
              Cell: this.formatGrade,
            },
            {
              Header: 'Grading Status',
              accessor: 'status',
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
    status: PropTypes.string,
    grade: PropTypes.number,
  })),
  loadSelectionForReview: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  listData: selectors.submissions.listData(state),
});

export const mapDispatchToProps = {
  initializeApp: thunkActions.app.initialize,
  loadSelectionForReview: thunkActions.app.loadSelectionForReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
