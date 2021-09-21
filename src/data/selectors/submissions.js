import _ from 'lodash';
import { createSelector } from 'reselect';

import { StrictDict } from 'utils';

export const simpleSelectors = {
  list: state => state.submissions.list,
};

/**
 * Returns the submission list in default order for the table.
 */
export const listData = createSelector(
  [simpleSelectors.list],
  (list) => _.sortBy(
    Object.values(list),
    ['submissionId'],
  ),
);

export default StrictDict({
  ...simpleSelectors,
  listData,
});
