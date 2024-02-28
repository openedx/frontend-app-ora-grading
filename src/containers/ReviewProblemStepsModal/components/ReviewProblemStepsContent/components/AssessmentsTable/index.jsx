import { useState } from 'react';
import {
  Row, Button, DataTable, Hyperlink,
} from '@edx/paragon';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import StatusBadge from 'components/StatusBadge';
import messages from './messages';
import './AssessmentsTable.scss';

export const AssessmentsTable = ({
  intl, assessmentsList, onClickReceivedAssessment, onClickGivenAssessment, isLoading,
}) => {
  const [assessmentSelected, setAssessmentSelected] = useState(
    'receivedAssessmentSelected',
  );
  const handleReceivedAssessments = () => {
    setAssessmentSelected('receivedAssessmentSelected');
    onClickReceivedAssessment();
  };
  const handleGivenAssessments = () => {
    setAssessmentSelected('givenAssessmentSelected');
    onClickGivenAssessment();
  };

  const assessmentScoreColumn = ({ value: assessmentScores }) => (
    <ul>
      {assessmentScores.map(({
        id, type, quality, rate,
      }) => (
        <li key={id}>
          {type}: {quality && rate ? `${quality} (${rate})` : '-'}
        </li>
      ))}
    </ul>
  );

  const assessmentEmailColumn = ({ value: email }) => (
    <Hyperlink destination="#" showLaunchIcon={false}>
      {email}
    </Hyperlink>
  );

  const assessmentProblemStepBadge = ({ value }) => (
    <Button
      variant="tertiary"
      className="step-problems-button-badge"
      key={value}
    >
      <StatusBadge
        status={value !== 'Peers' ? 'graded' : 'ungraded'}
        title={value}
      />
    </Button>
  );

  const isReceivedAssessmentSelected = assessmentSelected === 'receivedAssessmentSelected';

  return (
    <div className="mt-4 pl-2">
      <h3>{intl.formatMessage(messages.assessmentsTableTitle)}</h3>
      <Row className="ml-1 mt-4 mb-4">
        <Button
          className="assessmentButton"
          data-testid="assessments-received-button"
          variant={isReceivedAssessmentSelected ? 'primary' : 'inverse-primary'}
          onClick={handleReceivedAssessments}
        >
          {intl.formatMessage(messages.assessmentsReceivedButtonTitle)}
        </Button>
        <Button
          className="assessmentButton"
          data-testid="assessments-given-button"
          variant={
            assessmentSelected === 'givenAssessmentSelected'
              ? 'primary'
              : 'inverse-primary'
          }
          onClick={handleGivenAssessments}
        >
          {intl.formatMessage(messages.assessmentsGivenButtonTitle)}
        </Button>
      </Row>
      <DataTable
        isLoading={isLoading}
        isSelectable
        itemCount={assessmentsList.length}
        data={assessmentsList}
        columns={[
          {
            Header: intl.formatMessage(messages.assessmentIdColumnTitle),
            accessor: 'assessmentId',
          },
          {
            Header: isReceivedAssessmentSelected
              ? intl.formatMessage(messages.reviewerNameColumnTitle)
              : intl.formatMessage(messages.learnerNameColumnTitle),
            accessor: 'reviewerName',
          },
          {
            Header: intl.formatMessage(messages.usernameColumnTitle),
            accessor: 'userName',
          },
          {
            Header: intl.formatMessage(messages.emailColumnTitle),
            accessor: 'email',
            Cell: assessmentEmailColumn,
          },
          {
            Header: intl.formatMessage(messages.assessmentDateColumnTitle),
            accessor: 'assessmentDate',
          },
          {
            Header: intl.formatMessage(messages.assessmentScoresColumnTitle),
            accessor: 'assessmentScores',
            Cell: assessmentScoreColumn,
          },
          {
            Header: intl.formatMessage(messages.problemStepColumnTitle),
            accessor: 'problemStep',
            Cell: assessmentProblemStepBadge,
          },
          {
            Header: intl.formatMessage(messages.feedbackColumnTitle),
            accessor: 'feedback',
          },
        ]}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content="No results found" />
        <DataTable.TableFooter />
      </DataTable>
    </div>
  );
};

AssessmentsTable.defaultProps = {
  assessmentsList: [],
  isLoading: false,
};

AssessmentsTable.propTypes = {
  intl: intlShape.isRequired,
  onClickReceivedAssessment: PropTypes.func.isRequired,
  onClickGivenAssessment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  assessmentsList: PropTypes.arrayOf(
    PropTypes.shape({
      assessmentId: PropTypes.string.isRequired,
      reviewerName: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      assessmentDate: PropTypes.string.isRequired,
      assessmentScores: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          quality: PropTypes.string,
          rate: PropTypes.number,
        }),
      ).isRequired,
      problemStep: PropTypes.string.isRequired,
      feedback: PropTypes.string.isRequired,
    }),
  ),
};

export default injectIntl(AssessmentsTable);
