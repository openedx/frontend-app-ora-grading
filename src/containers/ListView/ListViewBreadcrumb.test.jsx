import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { Hyperlink } from '@openedx/paragon';

import * as constants from '@src/data/constants/app';
import urls from '@src/data/services/lms/urls';
import { selectors } from '@src/data/redux';

import {
  ListViewBreadcrumb,
  mapStateToProps,
} from './ListViewBreadcrumb';

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: (...args) => ({ courseId: args }),
      ora: {
        name: (...args) => ({ oraName: args }),
      },
    },
  },
}));

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `openResponseUrl(${courseId})`,
  ora: (courseId, locationId) => `oraUrl(${courseId}, ${locationId})`,
}));

let el;

describe('ListViewBreadcrumb component', () => {
  describe('component', () => {
    const props = {
      courseId: 'test-course-id',
      oraName: 'fake-ora-name',
    };
    beforeEach(() => {
      el = shallow(<ListViewBreadcrumb {...props} />);
    });
    test('snapshot: empty (no list data)', () => {
      expect(el.snapshot).toMatchSnapshot();
    });
    test('openResponse destination', () => {
      expect(
        el.instance.findByType(Hyperlink)[0].props.destination,
      ).toEqual(urls.openResponse(props.courseId));
    });
    test('ora destination', () => {
      expect(
        el.instance.findByType(Hyperlink)[1].props.destination,
      ).toEqual(urls.ora(props.courseId, constants.locationId()));
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('courseId loads from app.courseId', () => {
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
    test('oraName loads from app.ora.name', () => {
      expect(mapped.oraName).toEqual(selectors.app.ora.name(testState));
    });
  });
});
