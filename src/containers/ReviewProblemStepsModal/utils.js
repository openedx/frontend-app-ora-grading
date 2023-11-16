/* eslint-disable import/prefer-default-export */
import moment from 'moment';

export const formatDate = (value = '') => {
  const date = new Date(moment(value));
  return date.toLocaleString();
};

const formatGrade = (score) => (score === null ? '-' : `${score.pointsEarned}/${score.pointsPossible}`);

const capitalizeFirstLetter = (str = '') => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '');

export const transformObjectToDetail = ({
  fullname = '',
  username = '',
  email = '',
  submissionUUID = '',
  dateSubmitted = '',
  score,
  gradeStatus = '',
}) => ({
  fullname,
  username,
  email,
  submissionId: submissionUUID,
  submissionDate: formatDate(dateSubmitted),
  grade: formatGrade(score),
  gradingStatus: capitalizeFirstLetter(gradeStatus),

});
