import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from 'testUtils';
import {
  DataTable,
} from '@edx/paragon';

import messages from './messages';
import { AssessmentsTable } from '.';

describe('AssessmentsTable component', () => {
  let el;

  beforeEach(() => {
    el = shallow(<AssessmentsTable intl={{ formatMessage }} />);
  });
  it('renders without crashing', () => {
    expect(el.exists()).toBe(true);
  });

  it('renders the correct title', () => {
    const h3Title = el.find('h3');
    expect(h3Title.text()).toBe(
      formatMessage(messages.assessmentsTableTitle),
    );
  });

  it('should render assessment given button and assessment received button', () => {
    const assessmentReceivedButton = el.find('[data-testid="assessments-received-button"]');
    const assessmentGivenButton = el.find('[data-testid="assessments-given-button"]');

    expect(assessmentReceivedButton.exists()).toBe(true);
    expect(assessmentGivenButton.exists()).toBe(true);

    expect(assessmentReceivedButton.text()).toBe(
      formatMessage(messages.assessmentsReceivedButtonTitle),
    );
    expect(assessmentGivenButton.text()).toBe(
      formatMessage(messages.assessmentsGivenButtonTitle),
    );
  });

  describe('DataTable', () => {
    let table;
    let tableProps;
    beforeEach(() => {
      table = el.find(DataTable);
      tableProps = table.props();
    });
    test.each([
      'isSelectable',
    ])('%s', key => expect(tableProps[key]).toEqual(true));

    describe('individual columns', () => {
      let columns;
      beforeEach(() => {
        columns = tableProps.columns;
      });

      it('ID Assessment column', () => {
        expect(columns[0]).toEqual({
          Header: formatMessage(messages.idAssessmentColumnTitle),
          accessor: 'idAssessment',
        });
      });
      it('Reviewer name or Learner name column', () => {
        expect(columns[1]).toEqual({
          Header: formatMessage(messages.reviewerNameColumnTitle),
          accessor: 'reviewerName',
        });
      });
      it('User name column', () => {
        expect(columns[2]).toEqual({
          Header: formatMessage(messages.usernameColumnTitle),
          accessor: 'userName',
        });
      });
      it('Email column', () => {
        const emailColumn = tableProps.columns.find((column) => column.accessor === 'email');
        expect(emailColumn.Header).toBe(
          formatMessage(messages.emailColumnTitle),
        );
      });
      it('Assessment date column', () => {
        const assessmentDateColumn = tableProps.columns.find((column) => column.accessor === 'assessmentDate');
        expect(assessmentDateColumn.Header).toBe(
          formatMessage(messages.assessmentDateColumnTitle),
        );
      });

      it('Assessment scores column', () => {
        const assessmentScoresColumn = tableProps.columns.find((column) => column.accessor === 'assessmentScores');
        expect(assessmentScoresColumn.Header).toBe(
          formatMessage(messages.assessmentScoresColumnTitle),
        );
      });

      it('Problem step column', () => {
        const problemStepColumn = tableProps.columns.find((column) => column.accessor === 'problemStep');
        expect(problemStepColumn.Header).toBe(
          formatMessage(messages.problemStepColumnTitle),
        );
      });

      it('Feedback column', () => {
        const feedbackColumn = tableProps.columns.find((column) => column.accessor === 'feedback');
        expect(feedbackColumn.Header).toBe(
          formatMessage(messages.feedbackColumnTitle),
        );
      });
    });
  });
});
