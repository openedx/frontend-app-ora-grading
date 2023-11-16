import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux';
import api from 'data/services/lms/api';
import ResponsesList from './components/ResponsesList';
import AssessmentsTable from './components/AssessmentsTable';
import { assessmentTableFormat, responsesListFormat } from './utils';
import ErrorMessage from './components/ErrorMessage';
import messages from './messages';

import './ReviewProblemStepsContent.scss';

export const ReviewProblemStepsContent = ({
  intl, toggleShowRubric, submissionUUID = '', hasDetailSubmissionError, responses,
}) => {
  const [isLoadingFeedbackList, setIsLoadingFeedbackList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackListError, setFeedbackListError] = useState(null);
  const [feedbackListType, setFeedbackListType] = useState('received');
  const { text } = responses;
  const responsesList = responsesListFormat(text);

  useEffect(() => {
    const getFeedbackList = async () => {
      setIsLoadingFeedbackList(true);
      try {
        const data = await api.getFeedbackList(submissionUUID, feedbackListType);
        const { assessments } = data;
        const formatData = assessmentTableFormat(assessments);
        setFeedbackList(formatData);
      } catch (error) {
        setFeedbackListError('Error');
      } finally {
        setIsLoadingFeedbackList(false);
      }
    };
    getFeedbackList();
  }, [feedbackListType, submissionUUID]);

  return (
    <div className="review-problem-steps-content">
      { hasDetailSubmissionError ? (
        <ErrorMessage
          title={intl.formatMessage(messages.feedbackListTitleError)}
          message={intl.formatMessage(messages.feedbackListMessageError)}
        />
      ) : <ResponsesList toggleShowRubric={toggleShowRubric} responsesList={responsesList} /> }
      { feedbackListError && !isLoadingFeedbackList ? (
        <ErrorMessage
          title={intl.formatMessage(messages.feedbackListTitleError)}
          message={intl.formatMessage(messages.feedbackListMessageError)}
        />
      ) : (
        <AssessmentsTable
          isLoading={isLoadingFeedbackList}
          assessmentsList={feedbackList}
          onClickReceivedAssessment={() => setFeedbackListType('received')}
          onClickGivenAssessment={() => setFeedbackListType('given')}
        />
      )}

    </div>
  );
};

ReviewProblemStepsContent.propTypes = {
  toggleShowRubric: PropTypes.func.isRequired,
  submissionUUID: PropTypes.string.isRequired,
  hasDetailSubmissionError: PropTypes.string.isRequired,
  responses: PropTypes.shape({
    text: PropTypes.arrayOf(PropTypes.string).isRequired,
    files: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  intl: intlShape.isRequired,
};

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
};

export const mapStateToProps = (state) => ({
  showRubric: selectors.app.showRubric(state),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReviewProblemStepsContent));
