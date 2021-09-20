import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'submissions';
const createAction = createActionFactory(dataKey);

/**
 * Load the basic list-level submission data, keyed by submission id
 * @param {obj} submissionListData
 */
const loadList = createAction('loadList');

export default StrictDict({
  loadList,
});
