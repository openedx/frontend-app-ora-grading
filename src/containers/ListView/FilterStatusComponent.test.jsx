import React from 'react';
import { shallow } from 'enzyme';

import * as module from './FilterStatusComponent';

const fieldIds = [
  'field-id-0',
  'field-id-1',
  'field-id-2',
  'field-id-3',
];
const filterOrder = [1, 0, 3, 2];
const filters = filterOrder.map(v => ({ id: fieldIds[v] }));
const headers = [0, 1, 2, 3].map(v => ({
  id: fieldIds[v],
  Header: `HeaDer-${v}`,
}));

describe('FilterStatusComponent hooks', () => {
  const context = { headers, state: { filters } };
  const mockTableContext = (newContext) => {
    React.useContext.mockReturnValueOnce(newContext);
  };
  beforeEach(() => {
    context.setAllFilters = jest.fn();
  });
  it('returns empty dict if setAllFilters or state.filters is falsey', () => {
    mockTableContext({ ...context, setAllFilters: null });
    expect(module.filterHooks()).toEqual({});
    mockTableContext({ ...context, state: { filters: null } });
    expect(module.filterHooks()).toEqual({});
  });
  describe('clearFilters', () => {
    it('uses React.useCallback to clear filters, only once', () => {
      mockTableContext(context);
      const { cb, prereqs } = module.filterHooks().clearFilters.useCallback;
      expect(prereqs).toEqual([context.setAllFilters]);
      expect(context.setAllFilters).not.toHaveBeenCalled();
      cb();
      expect(context.setAllFilters).toHaveBeenCalledWith([]);
    });
  });
  describe('filterNames', () => {
    it('returns list of Header values by filter order', () => {
      mockTableContext(context);
      expect(module.filterHooks().filterNames).toEqual(
        filterOrder.map(v => headers[v].Header),
      );
    });
  });
});
describe('FilterStatusComponent component', () => {
  const props = {
    className: 'css-class-name',
    variant: 'button-variant',
    size: 'button-size',
    clearFiltersText: 'clear-filter-text',
    buttonClassName: 'css-class-name-for-button',
    showFilteredFields: true,
  };
  const hookProps = {
    clearFilters: jest.fn().mockName('hookProps.clearFilters'),
    filterNames: ['filter-name-0', 'filter-name-1'],
  };
  const { FilterStatusComponent } = module;
  const mockHooks = (value) => {
    jest.spyOn(module, 'filterHooks').mockReturnValueOnce(value);
  };
  describe('snapshot', () => {
    describe('with filters', () => {
      test('showFilteredFields', () => {
        mockHooks(hookProps);
        const el = shallow(<FilterStatusComponent {...props} />);
        expect(el).toMatchSnapshot();
      });
      test('showFilteredFields=false - hide filterTexts', () => {
        mockHooks(hookProps);
        const el = shallow(
          <FilterStatusComponent {...props} showFilteredFields={false} />,
        );
        expect(el).toMatchSnapshot();
      });
    });
    test('without filters', () => {
      mockHooks({});
      const el = shallow(<FilterStatusComponent {...props} />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
  });
});
