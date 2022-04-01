import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import * as module from './base';

export const rootSelector = ({ grading }) => grading;
export const mkSimpleSelector = (key) => createSelector(
  [module.rootSelector],
  (grading) => grading[key],
);
export const rootKeys = StrictDict({
  selection: 'selection',
  activeIndex: 'activeIndex',
  current: 'current',
  gradeData: 'gradeData',
  gradingData: 'gradingData',
});

export const simpleSelectors = {
  selection: mkSimpleSelector(rootKeys.selection),
  activeIndex: mkSimpleSelector(rootKeys.activeIndex),
  current: mkSimpleSelector(rootKeys.current),
  gradeData: mkSimpleSelector(rootKeys.gradeData),
  gradingData: mkSimpleSelector(rootKeys.gradingData),
};

/**
 * returns true iff any active grading sessions have started
 * @return {bool} does the session have any active grading progress
 */
export const hasGradingProgress = createSelector(
  [module.simpleSelectors.gradingData],
  (gradingData) => Object.keys(gradingData).length > 0,
);

/**
 * returns the length of the list of selected submissions
 * @return {number} selected submission list length
 */
export const selectionLength = createSelector(
  [module.simpleSelectors.selection],
  (selection) => selection.length,
);

export default {
  ...simpleSelectors,
  hasGradingProgress,
  selectionLength,
};
