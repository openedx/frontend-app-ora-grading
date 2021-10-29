import _ from 'lodash';
import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import { lockStatuses } from 'data/services/lms/constants';

export const simpleSelectors = {
  allSubmissions: state => state.submissions.allSubmissions,
};

/**
 * Returns the submission list in default order for the table.
 */
export const listData = createSelector(
  [simpleSelectors.allSubmissions],
  (allSubmissions) => {
    const submissionIds = Object.keys(allSubmissions);
    const submissionList = submissionIds.map(id => {
      const { gradeStatus, lockStatus, ...rest } = allSubmissions[id];
      const gradingStatus = (lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus);
      return { gradingStatus, ...rest };
    });
    return _.sortBy(
      submissionList,
      ['submissionDate'],
    );
  },
);

export default StrictDict({
  ...simpleSelectors,
  listData,
});
