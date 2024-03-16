import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { shallow } from '@edx/react-unit-test-utils';
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
    expect(el.snapshot).toMatchSnapshot();

    expect(el.instance.findByType('title')[0].el.children[0]).toContain(getConfig().SITE_NAME);
    expect(el.instance.findByType('link')[0].props.href).toEqual(getConfig().FAVICON_URL);
  });
});
