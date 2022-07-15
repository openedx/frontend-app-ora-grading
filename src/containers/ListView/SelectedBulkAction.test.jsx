import React from 'react';
import { shallow } from 'enzyme';

import { SelectedBulkAction } from './SelectedBulkAction';

describe('SelectedBulkAction component', () => {
  const props = {
    selectedFlatRows: [{ id: 1 }, { id: 2 }],
    handleClick: jest.fn(),
  };
  test('snapshots', () => {
    const el = shallow(<SelectedBulkAction {...props} handleClick={() => jest.fn()} />);
    expect(el).toMatchSnapshot();
  });

  test('handleClick', () => {
    shallow(<SelectedBulkAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.selectedFlatRows);
  });
});
