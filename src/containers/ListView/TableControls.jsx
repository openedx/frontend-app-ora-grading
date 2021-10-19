import React from 'react';

import {
  DataTable,
} from '@edx/paragon';

/**
 * <TableControls />
 */
export const TableControls = () => (
  <>
    <DataTable.TableControlBar />
    <DataTable.Table />
    <DataTable.EmptyTable content="No results found" />
    <DataTable.TableFooter />
  </>
);
TableControls.propTypes = {};

export default TableControls;
