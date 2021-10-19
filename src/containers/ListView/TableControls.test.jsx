import React from 'react';
import { shallow } from 'enzyme';

import TableControls from './TableControls';

jest.mock('@edx/paragon', () => ({
  DataTable: {
    TableControlBar: () => 'DataTable.TableControlBar',
    Table: () => 'DataTable.Table',
    EmptyTable: () => 'DataTable.EmptyTable',
    TableFooter: () => 'DataTable.TableFooter',
  },
}));

describe('ListView TableControls component', () => {
  describe('component', () => {
    test('snapshot', () => {
      expect(shallow(<TableControls />)).toMatchSnapshot();
    });
  });
});
