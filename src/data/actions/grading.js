import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'grading';
const createAction = createActionFactory(dataKey);

/**
 * Load the first of the selected submission list for review, and initializes
 * the review pane to the first index.
 * @param {obj} submission data for the review/grading view
 *   {
 *     {obj} response - api response data
 *     {obj} gradeData - api grade data
 *     {str} status - api grade status
 *   }
 */
const loadSubmission = createAction('loadSubmission');

/**
 * Pre-load just the static info about the "next" submission in the review queue.
 * Load submission and the learner's response.
 * @param {obj} submission ({ response })
 */
const preloadNext = createAction('preloadNext');

/**
 * Pre-load just the static info about the "previous" submission in the review queue.
 * Load submission and the learner's response.
 * @param {obj} submission ({ response })
 */
const preloadPrev = createAction('preloadPrev');

/**
 * Load the "next" submission in the selected queue as the current selection, load its current
 * status and grade data, and update prev/next accordingly.
 * @param {obj} { status, gradeData }
 */
const loadNext = createAction('loadNext');

/**
 * Load the "prev" submission in the selected queue as the current selection, load its current
 * status and grade data, and update prev/next accordingly.
 * @param {obj} { status, gradeData }
 */
const loadPrev = createAction('loadPrev');

/**
 * Load the selected submissions, storing their static data in an ordered array and setting the starting
 * index at the beginning of the list.
 * @param {obj[]} selection - ordered array of submission static data for all selected submissions
 */
const updateSelection = createAction('updateSelection');

// TODO: implement/design data workflow
const rubric = StrictDict({
  /*
   * update the local version of the rubric-level comment
   * @param {string} comment
   */
  updateComment: createAction('rubric/comment'),
  /*
   * update the local version of points for the given criterion
   * @param {number} index
   * @param {number} points
   */
  updateCriterionPoints: createAction('rubric/criterionPoints'),
  /*
   * update the local version of comment for the given criterion
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
  updateSelection,
  rubric,
});
