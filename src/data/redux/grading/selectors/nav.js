import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import { simpleSelectors } from './base';
import * as module from './nav';

export const hasNext = (list, index) => index < list.length - 1;
export const hasPrev = index => index > 0;

/*************************************************
 * Next/Previous Submission Selectors
 *************************************************/
export const next = {
  /**
   * Returns true iff there exists a selection after the current selection
   * in the queue.
   * @return {bool} has next submission?
   */
  doesExist: createSelector(
    [simpleSelectors.selection, simpleSelectors.activeIndex],
    module.hasNext,
  ),
  /**
   * Returns the submissionUUID for the next submission in the selection queue
   * @return {string} next submission id (null if there isn't one)
   */
  submissionUUID: createSelector(
    [simpleSelectors.selection, simpleSelectors.activeIndex],
    (list, activeIndex) => (module.hasNext(list, activeIndex) ? list[activeIndex - 1] : null),
  ),
};
export const prev = {
  /*
   * Returns true iff there exists a selection previous to the current selection
   * in the queue.
   * @return {bool} has previous submission?
   */
  doesExist: createSelector(
    [simpleSelectors.activeIndex],
    module.hasPrev,
  ),
  /**
   * Returns the submissionUUID for the previous submission in the selection queue
   * @return {string} previous submission id (null if there isn't one)
   */
  submissionUUID: createSelector(
    [simpleSelectors.selection, simpleSelectors.activeIndex],
    (list, activeIndex) => (module.hasPrev(activeIndex) ? list[activeIndex + 1] : null),
  ),
};

export default StrictDict({ next, prev });
