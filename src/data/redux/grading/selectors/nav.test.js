import { simpleSelectors } from './base';
import * as selectors from './nav';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

describe('nav grading selectors unit tests', () => {
  const list = [
    'element1',
    'element2',
    'element3',
    'element4',
    'element5',
  ];
  describe('next selectors', () => {
    describe('doesExist', () => {
      const selector = selectors.next.doesExist;
      const { cb, preSelectors } = selector;
      it('returns a memoized selector based on selection and activeIndex simpleSelectors', () => {
        expect(preSelectors).toEqual([
          simpleSelectors.selection,
          simpleSelectors.activeIndex,
        ]);
      });
      it('returns true iff the activeIndex not the end of the list', () => {
        expect(cb(list, list.length - 2)).toEqual(true);
        expect(cb(list, list.length - 1)).toEqual(false);
      });
    });
    describe('submissionUUID', () => {
      const selector = selectors.next.submissionUUID;
      const { cb, preSelectors } = selector;
      it('returns a memoized selector based on selection and activeIndex simpleSelectors', () => {
        expect(preSelectors).toEqual([
          simpleSelectors.selection,
          simpleSelectors.activeIndex,
        ]);
      });
      it('returns the next submissionUUID in the list if exists', () => {
        const index = list.length - 2;
        expect(cb(list, index)).toEqual(list[index - 1]);
      });
      it('returns null if unavailable', () => {
        expect(cb(list, list.length - 1)).toEqual(null);
      });
    });
  });
  describe('prev selectors', () => {
    describe('doesExist', () => {
      const selector = selectors.prev.doesExist;
      const { cb, preSelectors } = selector;
      it('returns a memoized selector based on activeIndex simpleSelector', () => {
        expect(preSelectors).toEqual([simpleSelectors.activeIndex]);
      });
      it('returns true iff the activeIndex not the beginning of the list', () => {
        expect(cb(1)).toEqual(true);
        expect(cb(0)).toEqual(false);
      });
    });
    describe('submissionUUID', () => {
      const selector = selectors.prev.submissionUUID;
      const { cb, preSelectors } = selector;
      it('returns a memoized selector based on selection and activeIndex simpleSelectors', () => {
        expect(preSelectors).toEqual([
          simpleSelectors.selection,
          simpleSelectors.activeIndex,
        ]);
      });
      it('returns the previous submissionUUID in the list if exists', () => {
        const index = 3;
        expect(cb(list, index)).toEqual(list[index + 1]);
      });
      it('returns null if unavailable', () => {
        expect(cb(list, 0)).toEqual(null);
      });
    });
  });
});
