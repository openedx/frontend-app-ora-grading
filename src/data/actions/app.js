import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'app';
const createAction = createActionFactory(dataKey);

export default StrictDict({
  loadCourseMetadata: createAction('loadCourseMetadata'),
  loadOraMetadata: createAction('loadOraMetadata'),
  setShowReview: createAction('setReview'),
  setGrading: createAction('setGrading'),
});
