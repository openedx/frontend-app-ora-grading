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
    expect(constants.routePath()).toEqual(`${platform.PUBLIC_PATH}:courseId`);
  });
  describe('locationId', () => {
    const domain = 'https://example.com';

    test('returns trimmed pathname', () => {
      const old = window.location;
      Object.defineProperty(window, 'location', {
        value: new URL(`${domain}${platform.PUBLIC_PATH}somePath.jpg`),
        writable: true,
      });
      expect(constants.locationId()).toEqual(window.location.pathname.replace(platform.PUBLIC_PATH, ''));
      window.location = old;
    });
    test('handle none-standard characters pathName', () => {
      const old = window.location;
      const noneStandardPath = `${platform.PUBLIC_PATH}ORG+%C4%90+2023`;
      const expectedPath = `${platform.PUBLIC_PATH}ORG+Đ+2023`;
      Object.defineProperty(window, 'location', {
        value: new URL(`${domain}${noneStandardPath}`),
        writable: true,
      });
      expect(noneStandardPath).not.toEqual(expectedPath);
      expect(constants.locationId()).toEqual(expectedPath.replace(platform.PUBLIC_PATH, ''));
      window.location = old;
    });
  });
});
