import React from 'react';
import { shallow } from 'enzyme';

import { TableAction } from './TableAction';

describe('TableAction component', () => {
  const props = {
    tableInstance: { rows: [{ id: 1 }, { id: 2 }] },
    handleClick: jest.fn(),
  };
  test('snapshots', () => {
    const el = shallow(<TableAction {...props} handleClick={() => jest.fn()} />);
    expect(el).toMatchSnapshot();
  });

  test('handleClick', () => {
    shallow(<TableAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.tableInstance.rows);
  });
});
