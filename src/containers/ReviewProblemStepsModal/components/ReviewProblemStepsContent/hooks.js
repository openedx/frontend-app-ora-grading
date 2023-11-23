import { useState, useEffect } from 'react';
import api from 'data/services/lms/api';
import { assessmentTableFormat } from './utils';

export const useFeedbackList = (submissionUUID) => {
  const [isLoadingFeedbackList, setIsLoadingFeedbackList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackListError, setFeedbackListError] = useState(null);
  const [feedbackListType, setFeedbackListType] = useState('received');

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

  return {
    isLoadingFeedbackList,
    feedbackList,
    feedbackListError,
    feedbackListType,
    setFeedbackListType,
  };
};
