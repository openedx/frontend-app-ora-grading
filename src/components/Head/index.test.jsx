import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { shallow } from 'enzyme';
import Head from '.';

jest.mock('react-helmet', () => ({
  Helmet: 'Helmet',
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    SITE_NAME: 'site-name',
    FAVICON_URL: 'favicon-url',
  }),
}));

describe('Head', () => {
  it('snapshot', () => {
    const el = shallow(<Head />);
    expect(el).toMatchSnapshot();

    expect(el.find('title').text()).toContain(getConfig().SITE_NAME);
    expect(el.find('link').prop('href')).toEqual(getConfig().FAVICON_URL);
  });
});
