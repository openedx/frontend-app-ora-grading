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
  (list, { learnerId }) => list.selected.indexOf(learnerId),
);

export const listData = createSelector(
  [simpleSelectors.list],
  (list) => _.sortBy(
    Object.values(list),
    ['learnerId'],
  ),
);

export const selectionLearnerId = (state, { index }) => (
  simpleSelectors.selected(state)[index].learnerId
);

export const currentSelection = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => list[activeIndex],
);

export const selectedLearnerId = createSelector(
  [currentSelection],
  (selection) => selection.learnerId,
);

export const prevLearnerId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex > 0) {
      return list[activeIndex - 1].learnerId;
    }
    return null;
  },
);
export const nextLearnerId = createSelector(
  [simpleSelectors.selected, simpleSelectors.activeIndex],
  (list, activeIndex) => {
    if (activeIndex < list.length - 1) {
      return list[activeIndex + 1].learnerId;
    }
    return null;
  },
);

export default StrictDict({
  ...simpleSelectors,
  currentSelection,
  selectionIndex,
  listData,
  selectedLearnerId,
  nextLearnerId,
  prevLearnerId,
});
