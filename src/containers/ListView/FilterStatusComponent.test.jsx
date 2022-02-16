import React from 'react';
import { shallow } from 'enzyme';
import * as module from './FilterStatusComponent';

const mockFilterHooks = {
  clearFilters: jest.fn().mockName('clearFilters'),
  filterNames: ['some abitary', 'column'],
};

const mockSetAllFilters = jest.fn().mockName('setAllFilters');

describe('FilterStatusComponent component', () => {
  const props = {
    className: 'css-class-name',
    variant: 'button-variant',
    size: 'button-size',
    clearFiltersText: 'clear-filter-text',
    buttonClassName: 'css-class-name-for-button',
    showFilteredFields: true,
  };

  const contextProps = {
    state: {
      filters: [
        {
          id: 'filter-column',
          value: 'abitary',
        },
      ],
    },
    setAllFilters: () => mockSetAllFilters,
    headers: [
      {
        id: 'filter-column',
        Header: 'Formatted Filter Column',
      },
      {
        id: 'dummy-column',
        Header: 'Not showing column',
      },
    ],
  };
  const { FilterStatusComponent } = module;
  describe('snapshot', () => {
    test('with filter', () => {
      jest.spyOn(module, 'filterHooks').mockImplementationOnce(() => mockFilterHooks);
      const el = shallow(<FilterStatusComponent {...props} />);
      expect(el).toMatchSnapshot();
    });

    test('with filter but do not show filterd field', () => {
      jest.spyOn(module, 'filterHooks').mockImplementationOnce(() => mockFilterHooks);
      const el = shallow(<FilterStatusComponent {...props} showFilteredFields={false} />);
      expect(el).toMatchSnapshot();
    });

    test('without filter', () => {
      jest.spyOn(module, 'filterHooks').mockImplementationOnce(() => ({}));
      const el = shallow(<FilterStatusComponent {...props} />);
      expect(el).toMatchSnapshot();
    });
  });

  describe('component', () => {
    test('clear filter click', () => {
      jest.spyOn(module, 'filterHooks').mockImplementationOnce(() => mockFilterHooks);
      const el = shallow(<FilterStatusComponent {...props} />);
      el.find('Button').simulate('click');
      expect(mockFilterHooks.clearFilters).toHaveBeenCalledTimes(1);
    });

    test('on clear filter, set all filter get called with empty array', () => {
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => ({ ...contextProps }));
      jest.spyOn(React, 'useCallback').mockImplementationOnce(cb => cb());
      const el = shallow(<FilterStatusComponent {...props} />);
      el.find('Button').simulate('click');
      expect(mockSetAllFilters).toHaveBeenCalledTimes(1);
    });
  });
});
