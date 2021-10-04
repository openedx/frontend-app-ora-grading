import React from 'react';
import { shallow } from 'enzyme';

import CourseLabel from './CourseLabel';

const courseData = {
  courseOrg: 'course-org',
  courseNumber: 'course-number',
  courseTitle: 'course-title',
};

describe('Header CourseLabel component', () => {
  test('snapshot', () => {
    expect(
      shallow(<CourseLabel {...courseData} />),
    ).toMatchSnapshot();
  });
});
