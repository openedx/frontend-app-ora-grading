import { useState, useEffect } from 'react';
import api from 'data/services/lms/api';
import { assessmentTableFormat } from './utils';

/**
 * Custom React Hook to manage feedback list data.
 *
 * @param {string} submissionUUID - The UUID of the submission.
 * @returns {object} An object containing feedback list data and functions to manage it.
 */
export const useFeedbackList = (submissionUUID) => {
  const [isLoadingFeedbackList, setIsLoadingFeedbackList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackListError, setFeedbackListError] = useState(null);
  const [feedbackListType, setFeedbackListType] = useState('received');

  /**
   * Fetches feedback list data from the API based on submission UUID and type.
   *
   * @returns {Promise<void>} A Promise representing the asynchronous API call.
   */
  const getFeedbackListApi = async () => {
    if (submissionUUID) {
      setIsLoadingFeedbackList(true);
      try {
        const data = await api.getFeedbackList(submissionUUID, feedbackListType);
        const { assessments } = data;
        const formatData = assessmentTableFormat(assessments);
        setFeedbackList(formatData);
      } catch (error) {
        setFeedbackListError(error.message);
      } finally {
        setIsLoadingFeedbackList(false);
      }
    }
  };

  useEffect(() => {
    /* istanbul ignore next */
    getFeedbackListApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackListType, submissionUUID]);

  return {
    isLoadingFeedbackList,
    feedbackList,
    feedbackListError,
    feedbackListType,
    setFeedbackListType,
    getFeedbackListApi,
  };
};
