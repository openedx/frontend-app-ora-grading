import { v4 as uuidv4 } from 'uuid';

/**
 * Formats an array of assessment data into a specific structure.
 * @param {Array} arr - The array containing assessment data.
 * @returns {Array} - Returns an array of formatted assessment data.
 */
export const assessmentTableFormat = (arr) => arr.map(({
  assessmentId, assessmentDate, scorerEmail, scorerName, scorerUsername, feedback, problemStep, assessmentScores,
}) => {
  const newAssessmentScores = assessmentScores.map(({ criterionName, scoreEarned, scoreType }) => ({
    id: uuidv4(), type: criterionName, quality: scoreType, rate: scoreEarned,
  }));
  return {
    assessmentId,
    reviewerName: scorerName,
    userName: scorerUsername,
    email: scorerEmail,
    assessmentDate,
    assessmentScores: newAssessmentScores,
    feedback,
    problemStep,
  };
}, []);

/**
 * Formats an array of responses into a specific structure.
 * @param {Array} [responses=[]] - The array containing responses data.
 * @returns {Array} - Returns an array of formatted responses.
 */
export const responsesListFormat = (responses = []) => {
  if (!Array.isArray(responses)) {
    return [];
  }

  return responses.map((response, index) => ({
    id: uuidv4(),
    title: `Prompt ${index + 1}`,
    response,
  }));
};
