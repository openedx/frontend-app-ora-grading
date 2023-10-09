import { useState } from 'react';
import {
  Row, Button,
  DataTable,
  Hyperlink,
} from '@edx/paragon';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import StatusBadge from 'components/StatusBadge';
import messages from './messages';
import './AssessmentsTable.scss';

import { receivedAssessmentData, givenAssessmentData } from './constants';

const AssessmentsTable = ({ intl }) => {
  const [assessmentSelected, setAssessmentSelected] = useState('receivedAssessmentSelected');
  const handleReceivedAssessments = () => {
    setAssessmentSelected('receivedAssessmentSelected');
  };
  const handleGivenAssessments = () => {
    setAssessmentSelected('givenAssessmentSelected');
  };

  const assessmentScoreColumn = ({ value: assessmentScores }) => (
    <ul>
      {assessmentScores.map(({
        id, type, quality, rate,
      }) => <li key={id}>{type}: {quality && rate ? `${quality} (${rate})` : '-'}</li>)}
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
      onClick={() => null}
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
        <Button className="assessmentButton" variant={isReceivedAssessmentSelected ? 'primary' : 'inverse-primary'} onClick={handleReceivedAssessments}>{intl.formatMessage(messages.assessmentsReceivedButtonTitle)}</Button>
        <Button className="assessmentButton" variant={assessmentSelected === 'givenAssessmentSelected' ? 'primary' : 'inverse-primary'} onClick={handleGivenAssessments}>{intl.formatMessage(messages.assessmentsGivenButtonTitle)}</Button>
      </Row>
      <DataTable
        isSelectable
        itemCount={isReceivedAssessmentSelected ? receivedAssessmentData.length : givenAssessmentData.length}
        data={isReceivedAssessmentSelected ? receivedAssessmentData : givenAssessmentData}
        columns={[
          {
            Header: 'ID Assessment',
            accessor: 'idAssessment',
          },
          {
            Header: isReceivedAssessmentSelected ? 'Reviewer name' : 'Learner name',
            accessor: 'reviewerName',
          },
          {
            Header: 'Username',
            accessor: 'userName',
          },
          {
            Header: 'Email',
            accessor: 'email',
            Cell: assessmentEmailColumn,
          },
          {
            Header: 'Assesment date',
            accessor: 'assessmentDate',
          },
          {
            Header: 'Assesment scores',
            accessor: 'assessmentScores',
            Cell: assessmentScoreColumn,
          },
          {
            Header: 'Problem step',
            accessor: 'problemStep',
            Cell: assessmentProblemStepBadge,
          },
          {
            Header: 'Feedback',
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

AssessmentsTable.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AssessmentsTable);
