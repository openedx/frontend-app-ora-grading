import { v4 as uuidv4 } from 'uuid';

export const assessmentTableFormat = (arr) => arr.map(({
  idAssessment, assesmentDate, scorerEmail, scorerName, scorerUsername, feedback, problemStep, assesmentScores,
}) => {
  const newAssesmentScores = assesmentScores.map(({ criterionName, scoreEarned, scoreType }) => ({
    id: uuidv4(), type: criterionName, quality: scoreType, rate: scoreEarned,
  }));
  return {
    idAssessment,
    reviewerName: scorerName,
    userName: scorerUsername,
    email: scorerEmail,
    assessmentDate: assesmentDate,
    assessmentScores: newAssesmentScores,
    feedback,
    problemStep,
  };
}, []);

export const responsesListFormat = (arr = []) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr.map((response, index) => ({
    id: uuidv4(),
    title: `Prompt ${index + 1}`,
    response,
  }));
};
