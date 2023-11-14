import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { TableAction } from './TableAction';

describe('TableAction component', () => {
  const props = {
    tableInstance: { rows: [{ id: 1 }, { id: 2 }] },
    handleClick: jest.fn(),
  };
  test('snapshots', () => {
    const el = shallow(<TableAction {...props} handleClick={() => jest.fn()} />);
    expect(el.snapshot).toMatchSnapshot();
  });

  test('Inactive Button "View All Responses"', () => {
    const emptyProps = {
      tableInstance: { rows: [] },
      handleClick: jest.fn(),
    };
    const el = shallow(<TableAction {...emptyProps} />);
    expect(el.snapshot).toMatchSnapshot();
  });

  test('handleClick', () => {
    shallow(<TableAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.tableInstance.rows);
  });
});
