import React from 'react';
import { shallow } from 'enzyme';

import Footer from '@edx/frontend-component-footer';

import ListView from 'containers/ListView';

import { App } from './App';

jest.mock('@edx/frontend-component-footer', () => 'Footer');
jest.mock('containers/ListView', () => 'ListView');
jest.mock('containers/CourseHeader', () => 'CourseHeader');

const logo = 'fakeLogo.png';
let el;
let router;

describe('App router component', () => {
  const props = {
    courseMetadata: {
      org: 'course-org',
      number: 'course-number',
      title: 'course-title',
    },
  };
  test('snapshot', () => {
    expect(shallow(<App {...props} />)).toMatchSnapshot();
  });
  describe('component', () => {
    beforeEach(() => {
      process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG = logo;
      el = shallow(<App {...props} />);
      router = el.childAt(0);
    });
    describe('Router', () => {
      test('Routing - ListView is only route', () => {
        expect(router.find('main')).toEqual(shallow(
          <main><ListView /></main>,
        ));
      });
    });
    test('Footer logo drawn from env variable', () => {
      expect(router.find(Footer).props().logo).toEqual(logo);
    });
  });
});
