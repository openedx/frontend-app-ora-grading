import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { formatMessage } from '@src/testUtils';
import { keyStore } from '@src/utils';
import { ErrorStatuses } from '@src/data/constants/requests';

import { FileRenderer } from './FileRenderer';
import * as hooks from './hooks';

jest.mock('./FileCard', () => 'FileCard');
jest.mock('./Banners', () => ({
  ErrorBanner: () => 'ErrorBanner',
  LoadingBanner: () => 'LoadingBanner',
}));

const hookKeys = keyStore(hooks);

const props = {
  file: {
    downloadUrl: 'file download url',
    name: 'filename.txt',
  },
  intl: { formatMessage },
};
describe('FileRenderer', () => {
  describe('component', () => {
    describe('snapshot', () => {
      test('isLoading, no Error', () => {
        const hookProps = {
          Renderer: () => 'Renderer',
          isloading: true,
          errorStatus: null,
          error: null,
          rendererProps: { prop: 'hooks.rendererProps' },
        };
        jest.spyOn(hooks, hookKeys.renderHooks).mockReturnValueOnce(hookProps);
        expect(shallow(<FileRenderer {...props} />).snapshot).toMatchSnapshot();
      });
      test('is not loading, with error', () => {
        const hookProps = {
          Renderer: () => 'Renderer',
          isloading: false,
          errorStatus: ErrorStatuses.serverError,
          error: { prop: 'hooks.errorProps' },
          rendererProps: { prop: 'hooks.rendererProps' },
        };
        jest.spyOn(hooks, hookKeys.renderHooks).mockReturnValueOnce(hookProps);
        expect(shallow(<FileRenderer {...props} />).snapshot).toMatchSnapshot();
      });
    });
  });
});
