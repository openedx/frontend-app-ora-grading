import React from 'react';
import { shallow } from 'enzyme';

import { AppContext } from '@edx/frontend-platform/react';
import { Header } from '.';

jest.mock('./AnonymousUserMenu', () => 'AnonymousUserMenu');
jest.mock('./AuthenticatedUserDropdown', () => 'AuthenticatedUserDropdown');
jest.mock('./LinkedLogo', () => 'LinkedLogo');
jest.mock('./CourseLabel', () => 'CourseLabel');

jest.mock('@edx/frontend-platform/react', () => ({
  AppContext: { authenticatedUser: null },
}));
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: (context) => context,
}));

const courseData = {
  courseOrg: 'course-org',
  courseNumber: 'course-number',
  courseTitle: 'course-title',
};

describe('Header component', () => {
  const props = {
    ...courseData,
    intl: { formatMessage: (msg) => msg.defaultMessage },
  };
  test('snapshot', () => {
    expect(shallow(<Header {...props} />)).toMatchSnapshot();
  });
  test('snapshot with authenticatedUser', () => {
    AppContext.authenticatedUser = { username: 'test' };
    expect(shallow(<Header {...props} />)).toMatchSnapshot();
  });
});
