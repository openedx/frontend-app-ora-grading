import * as platform from '@edx/frontend-platform';
import * as constants from './app';

jest.unmock('./app');

jest.mock('@edx/frontend-platform', () => {
  const PUBLIC_PATH = '/test-public-path/';
  return {
    getConfig: () => ({ PUBLIC_PATH }),
    PUBLIC_PATH,
  };
});

describe('app constants', () => {
  test('route path draws from public path and adds courseId', () => {
    expect(constants.getRoutePath()).toEqual(`${platform.PUBLIC_PATH}:courseId`);
  });
  test('locationId returns trimmed pathname', () => {
    const path = 'somepath.jpg';
    const old = window.location;
    delete window.location;
    window.location = new URL(`http://foo.bar${platform.PUBLIC_PATH}${path}`);
    expect(constants.getLocationId()).toEqual(path);
    window.location = old;
  });
});
