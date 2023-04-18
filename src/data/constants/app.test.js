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
    expect(constants.routePath).toEqual(`${platform.PUBLIC_PATH}:courseId`);
  });
  test('locationId returns trimmed pathname', () => {
    const old = window.location;
    window.location = { pathName: `${platform.PUBLIC_PATH}somePath.jpg` };
    expect(constants.locationId).toEqual(window.location.pathname.replace(platform.PUBLIC_PATH, ''));
    window.location = old;
  });
});
