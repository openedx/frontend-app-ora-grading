import React from 'react';
import { shallow } from 'enzyme';

import {
  DataTable,
  MultiSelectDropdownFilter,
  TextFilter,
} from '@edx/paragon';

import { selectors, thunkActions } from 'data/redux';
import { gradingStatuses as statuses, submissionFields } from 'data/services/lms/constants';

import StatusBadge from 'components/StatusBadge';
import { formatMessage } from 'testUtils';
import messages from './messages';
import {
  SubmissionsTable,
  mapStateToProps,
  mapDispatchToProps,
} from './SubmissionsTable';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      ora: {
        isIndividual: (...args) => ({ isIndividual: args }),
      },
    },
    submissions: {
      listData: (...args) => ({ listData: args }),
    },
  },
  thunkActions: {
    grading: {
      loadSelectionForReview: (...args) => ({ loadSelectionForReview: args }),
    },
  },
}));

let el;
jest.useFakeTimers('modern');

const individualData = [
  {
    username: 'username-1',
    dateSubmitted: 16131215154955,
    gradingStatus: statuses.ungraded,
    score: {
      pointsEarned: 1,
      pointsPossible: 10,
    },
  },
  {
    username: 'username-2',
    dateSubmitted: 16131225154955,
    gradingStatus: statuses.graded,
    score: {
      pointsEarned: 2,
      pointsPossible: 10,
    },
  },
  {
    username: 'username-3',
    dateSubmitted: 16131215250955,
    gradingStatus: statuses.inProgress,
    score: {
      pointsEarned: 3,
      pointsPossible: 10,
    },
  },
];

const teamData = [
  {
    teamName: 'teamName-1',
    dateSubmitted: 16131215154955,
    gradingStatus: statuses.ungraded,
    score: {
      pointsEarned: 1,
      pointsPossible: 10,
    },
  },
  {
    teamName: 'teamName-2',
    dateSubmitted: 16131225154955,
    gradingStatus: statuses.graded,
    score: {
      pointsEarned: 2,
      pointsPossible: 10,
    },
  },
  {
    teamName: 'teamName-3',
    dateSubmitted: 16131215250955,
    gradingStatus: statuses.inProgress,
    score: {
      pointsEarned: 3,
      pointsPossible: 10,
    },
  },
];

describe('SubmissionsTable component', () => {
  describe('component', () => {
    const props = {
      isIndividual: true,
      listData: [...individualData],
    };
    beforeEach(() => {
      props.loadSelectionForReview = jest.fn();
      props.intl = { formatMessage };
    });
    describe('render tests', () => {
      const mockMethod = (methodName) => {
        el.instance()[methodName] = jest.fn().mockName(`this.${methodName}`);
      };
      beforeEach(() => {
        el = shallow(<SubmissionsTable {...props} />);
      });
      describe('snapshots', () => {
        beforeEach(() => {
          mockMethod('handleViewAllResponsesClick');
          mockMethod('selectedBulkAction');
          mockMethod('formatDate');
          mockMethod('formatGrade');
          mockMethod('formatStatus');
        });
        test('no list data should show default empty table', () => {
          el = shallow(<SubmissionsTable {...props} listData={[]} />);
          expect(el).toMatchSnapshot();
          expect(el.isEmptyRender()).toEqual(false);
        });
        test('happy path', () => {
          expect(el.instance().render()).toMatchSnapshot();
        });
        test('team happy path', () => {
          el.setProps({ isIndividual: false, listData: [...teamData] });
          expect(el.instance().render()).toMatchSnapshot();
        });
      });
      describe('DataTable', () => {
        let table;
        let tableProps;
        beforeEach(() => {
          table = el.find(DataTable);
          tableProps = table.props();
        });
        test.each([
          'isFilterable',
          'isSelectable',
          'isSortable',
          'isPaginated',
        ])('%s', key => expect(tableProps[key]).toEqual(true));
        test.each([
          ['numBreakoutFilters', 2],
          ['defaultColumnValues', { Filter: TextFilter }],
          ['itemCount', 3],
          ['initialState', { pageSize: 10, pageIndex: 0 }],
        ])('%s = %p', (key, value) => expect(tableProps[key]).toEqual(value));
        test('bulkActions linked to selectedBulkAction', () => {
          expect(tableProps.bulkActions).toEqual([el.instance().selectedBulkAction]);
        });
        describe('individual columns', () => {
          let columns;
          beforeEach(() => {
            columns = tableProps.columns;
          });
          test('username column', () => {
            expect(columns[0]).toEqual({
              Header: messages.username.defaultMessage,
              accessor: submissionFields.username,
            });
          });
          test('submission date column', () => {
            expect(columns[1]).toEqual({
              Header: messages.learnerSubmissionDate.defaultMessage,
              accessor: submissionFields.dateSubmitted,
              Cell: el.instance().formatDate,
              disableFilters: true,
            });
          });
          test('grade column', () => {
            expect(columns[2]).toEqual({
              Header: messages.grade.defaultMessage,
              accessor: submissionFields.score,
              Cell: el.instance().formatGrade,
              disableFilters: true,
            });
          });
          test('grading status column', () => {
            expect(columns[3]).toEqual({
              Header: messages.gradingStatus.defaultMessage,
              accessor: submissionFields.gradingStatus,
              Cell: el.instance().formatStatus,
              Filter: MultiSelectDropdownFilter,
              filter: 'includesValue',
              filterChoices: el.instance().gradeStatusOptions,
            });
          });
        });
        describe('team columns', () => {
          let columns;
          beforeEach(() => {
            el.setProps({ isIndividual: false, listData: [...teamData] });
            columns = el.find(DataTable).props().columns;
          });
          test('teamName column', () => {
            expect(columns[0]).toEqual({
              Header: messages.teamName.defaultMessage,
              accessor: submissionFields.teamName,
            });
          });
          test('submission date column', () => {
            expect(columns[1]).toEqual({
              Header: messages.teamSubmissionDate.defaultMessage,
              accessor: submissionFields.dateSubmitted,
              Cell: el.instance().formatDate,
              disableFilters: true,
            });
          });
          test('grade column', () => {
            expect(columns[2]).toEqual({
              Header: messages.grade.defaultMessage,
              accessor: submissionFields.score,
              Cell: el.instance().formatGrade,
              disableFilters: true,
            });
          });
          test('grading status column', () => {
            expect(columns[3]).toEqual({
              Header: messages.gradingStatus.defaultMessage,
              accessor: submissionFields.gradingStatus,
              Cell: el.instance().formatStatus,
              Filter: MultiSelectDropdownFilter,
              filter: 'includesValue',
              filterChoices: el.instance().gradeStatusOptions,
            });
          });
        });
      });
    });
    describe('behavior', () => {
      describe('formatDate method', () => {
        it('returns the date in locale time string', () => {
          const fakeDate = 16131215154955;
          const fakeDateString = 'test-date-string';
          const mock = jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue(fakeDateString);
          expect(el.instance().formatDate({ value: fakeDate })).toEqual(fakeDateString);
          mock.mockRestore();
        });
      });
      describe('formatGrade method', () => {
        it('returns "-" if grade is null', () => {
          expect(el.instance().formatGrade({ value: null })).toEqual('-');
        });
        it('returns <pointsEarned>/<pointsPossible> if grade exists', () => {
          expect(
            el.instance().formatGrade({ value: { pointsEarned: 1, pointsPossible: 10 } }),
          ).toEqual('1/10');
        });
      });
      describe('formatStatus method', () => {
        it('returns a StatusBadge with the given status', () => {
          const status = 'graded';
          expect(el.instance().formatStatus({ value: 'graded' })).toEqual(
            <StatusBadge status={status} />,
          );
        });
      });
      describe('handleViewAllResponsesClick', () => {
        it('calls loadSelectionForReview with submissionUUID from all rows if there are no selectedRows', () => {
          const data = {
            selectedRows: [
            ],
            tableInstance: {
              rows: [
                { original: { submissionUUID: '123' } },
                { original: { submissionUUID: '456' } },
                { original: { submissionUUID: '789' } },
              ],
            },
          };
          el.instance().handleViewAllResponsesClick(data);
          expect(el.instance().props.loadSelectionForReview).toHaveBeenCalledWith(['123', '456', '789']);
        });
        it('calls loadSelectionForReview with submissionUUID from selected rows if there are any', () => {
          const data = {
            selectedRows: [
              { original: { submissionUUID: '123' } },
              { original: { submissionUUID: '456' } },
              { original: { submissionUUID: '789' } },
            ],
          };
          el.instance().handleViewAllResponsesClick(data);
          expect(
            el.instance().props.loadSelectionForReview,
          ).toHaveBeenCalledWith(['123', '456', '789']);
        });
      });
      describe('selectedBulkAction', () => {
        it('includes selection length and triggers handleViewAllResponsesClick', () => {
          const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          const action = el.instance().selectedBulkAction(rows);
          expect(action.buttonText).toEqual(expect.stringContaining(rows.length.toString()));
          expect(action.handleClick).toEqual(el.instance().handleViewAllResponsesClick);
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('listData loads from submissions.listData', () => {
      expect(mapped.listData).toEqual(selectors.submissions.listData(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads loadSelectionForReview from thunkActions.grading.loadSelectionForReview', () => {
      expect(
        mapDispatchToProps.loadSelectionForReview,
      ).toEqual(thunkActions.grading.loadSelectionForReview);
    });
  });
});
