import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'app';
const createAction = createActionFactory(dataKey);

export const loadCourseMetadata = createAction('loadCourseMetadata');
export const loadOraMetadata = createAction('loadOraMetadata');
export const setGrading = createAction('setGrading');
export const setShowReview = createAction('setReview');

export default StrictDict({
  loadCourseMetadata,
  loadOraMetadata,
  setGrading,
  setShowReview,
});
