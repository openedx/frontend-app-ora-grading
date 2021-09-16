import _ from 'lodash';
import { createSelector } from 'reselect';

import { StrictDict } from 'utils';

const simpleSelectors = {
  list: state => state.submissions.list,
  selected: state => state.submissions.selected,
  activeIndex: state => state.submissions.activeIndex,
  selectedResponse: state => state.submissions.current.response,
};

export const selectionIndex = createSelector(
  [simpleSelectors.list],
  (list, { submissionId }) => list.selected.indexOf(submissionId),
);

export const listData = createSelector(
  [simpleSelectors.list],
  (list) => _.sortBy(
    Object.values(list),
    ['submissionId'],
  ),
);

export const selectionSubmissionId = (state, { index }) => (
  simpleSelectors.selected(state)[index].submissionId
);

export const currentSelection = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => list[activeIndex],
);

export const selectedSubmissionId = createSelector(
  [currentSelection],
  (selection) => selection.submissionId,
);

export const prevSubmissionId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex > 0) {
      return list[activeIndex - 1].submissionId;
    }
    return null;
  },
);
export const nextSubmissionId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex < list.length - 1) {
      return list[activeIndex + 1].submissionId;
    }
    return null;
  },
);

export default StrictDict({
  ...simpleSelectors,
  currentSelection,
  selectionIndex,
  listData,
  selectedSubmissionId,
  nextSubmissionId,
  prevSubmissionId,
});
