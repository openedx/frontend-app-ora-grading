import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import * as module from './base';

export const rootSelector = ({ grading }) => grading;
export const mkSimpleSelector = (key) => createSelector(
  [module.rootSelector],
  (grading) => grading[key],
);
export const rootKeys = StrictDict({
  selected: 'selected',
  activeIndex: 'activeIndex',
  current: 'current',
  gradeData: 'gradeData',
  gradingData: 'gradingData',
});

export const simpleSelectors = {
  selected: mkSimpleSelector(rootKeys.selected),
  activeIndex: mkSimpleSelector(rootKeys.activeIndex),
  current: mkSimpleSelector(rootKeys.current),
  gradeData: mkSimpleSelector(rootKeys.gradeData),
  gradingData: mkSimpleSelector(rootKeys.gradingData),
};

/**
 * returns the length of the list of selected submissions
 * @return {number} selected submission list length
 */
export const selectionLength = createSelector(
  [module.simpleSelectors.selected],
  (selected) => selected.length,
);

export default {
  ...simpleSelectors,
  selectionLength,
};
