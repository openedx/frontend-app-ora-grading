import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'submissions';
const createAction = createActionFactory(dataKey);

/*
 * @param {obj} submission
 *   { submissionId, response, grade, status, rubric }
 */
const loadSubmission = createAction('loadSubmission');
/*
 * @param {obj} submission
 *   { submissionId, response, grade, status, rubric }
 */
const preloadNext = createAction('preloadNext');
/*
 * @param {obj} submission
 *   { submissionId, response, grade, status, rubric }
 */
const preloadPrev = createAction('preloadPrev');
/*
 * @param {obj} { status, grade }
 */
const loadNext = createAction('loadNext');
/*
 * @param {obj} { status, grade }
 */
const loadPrev = createAction('loadPrev');

const loadList = createAction('loadList');
const updateSelection = createAction('updateSelection');

const rubric = StrictDict({
  /*
   * @param {string} comment
   */
  updateComment: createAction('rubric/comment'),
  /*
   * @param {number} index
   * @param {number} points
   */
  updateCriterionPoints: createAction('rubric/criterionPoints'),
  /*
   * @param {number} index
   * @param {string} comments
   */
  updateCriterionComment: createAction('rubric/criterionComment'),
});

export default StrictDict({
  loadSubmission,
  preloadNext,
  preloadPrev,
  loadNext,
  loadPrev,
  loadList,
  updateSelection,
  rubric,
});
