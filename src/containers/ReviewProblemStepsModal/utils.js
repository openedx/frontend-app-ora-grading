/* eslint-disable import/prefer-default-export */
import moment from 'moment';

/**
 * Formats the provided date value into a localized string.
 * @param {string} [value=''] - The date string to format.
 * @returns {string} - The formatted date string in a localized format.
 */
export const formatDate = (value = '') => {
  const date = new Date(moment(value));
  return date.toLocaleString();
};

/**
 * Formats the grade score or returns a placeholder '-' if the score is null.
 * @param {object|null} score - The score object containing pointsEarned and pointsPossible.
 * @returns {string} - The formatted grade string or '-' if the score is null.
 */
export const formatGrade = (score) => (!score ? '-' : `${score.pointsEarned}/${score.pointsPossible}`);

/**
 * Capitalizes the first letter of the provided string.
 * @param {string} [str=''] - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str = '') => (str ? `${str.charAt(0).toUpperCase()}${str.slice(1)}` : '');

/**
 * Transforms an object to a detail object with specific key transformations and formatting.
 * @param {object} param0 - The object containing details.
 * @param {string} [param0.fullname=''] - The full name.
 * @param {string} [param0.username=''] - The username.
 * @param {string} [param0.email=''] - The email address.
 * @param {string} [param0.submissionUUID=''] - The submission UUID.
 * @param {string} [param0.dateSubmitted=''] - The date of submission.
 * @param {object|null} param0.score - The score object containing pointsEarned and pointsPossible.
 * @param {string} [param0.gradeStatus=''] - The grade status.
 * @returns {object} - The transformed detail object.
 */
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
