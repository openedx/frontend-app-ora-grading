import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { DataTableContext } from '@openedx/paragon';

import * as module from './FilterStatusComponent';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const fieldIds = ['field-id-0', 'field-id-1', 'field-id-2', 'field-id-3'];
const filterOrder = [1, 0, 3, 2];
const filters = filterOrder.map((v) => ({ id: fieldIds[v] }));
const headers = [0, 1, 2, 3].map((v) => ({
  id: fieldIds[v],
  Header: `HeaDer-${v}`,
}));

describe('FilterStatusComponent component', () => {
  const props = {
    className: 'css-class-name',
    variant: 'button-variant',
    size: 'button-size',
    clearFiltersText: 'clear-filter-text',
    buttonClassName: 'css-class-name-for-button',
    showFilteredFields: true,
  };
  const { FilterStatusComponent } = module;

  const renderWithContext = (contextValue, componentProps = props) => {
    const TestWrapper = ({ children }) => (
      <DataTableContext.Provider value={contextValue}>
        {children}
      </DataTableContext.Provider>
    );
    TestWrapper.propTypes = {
      children: PropTypes.node,
    };
    return render(
      <TestWrapper>
        <FilterStatusComponent {...componentProps} />
      </TestWrapper>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('does not render when there are no filters', () => {
      const contextValue = {
        headers,
        state: { filters: null },
        setAllFilters: jest.fn(),
      };
      const { container } = renderWithContext(contextValue);
      expect(container.firstChild).toBeNull();
    });

    it('does not render when setAllFilters is not available', () => {
      const contextValue = { headers, state: { filters }, setAllFilters: null };
      const { container } = renderWithContext(contextValue);
      expect(container.firstChild).toBeNull();
    });

    it('renders clear filters button with correct text when filters exist', () => {
      const contextValue = {
        headers,
        state: { filters },
        setAllFilters: jest.fn(),
      };
      const { getByText } = renderWithContext(contextValue);
      expect(getByText(props.clearFiltersText)).toBeInTheDocument();
    });

    it('displays filtered field names when showFilteredFields is true', () => {
      const contextValue = {
        headers,
        state: { filters },
        setAllFilters: jest.fn(),
      };
      const { getByText } = renderWithContext(contextValue);
      const expectedFilterNames = filterOrder.map((v) => headers[v].Header);
      expectedFilterNames.forEach((name) => {
        expect(getByText(name, { exact: false })).toBeInTheDocument();
      });
    });

    it('does not display filtered field names when showFilteredFields is false', () => {
      const contextValue = {
        headers,
        state: { filters },
        setAllFilters: jest.fn(),
      };
      const { queryByText } = renderWithContext(contextValue, {
        ...props,
        showFilteredFields: false,
      });
      expect(queryByText(/Filtered by/)).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to the component', () => {
      const contextValue = {
        headers,
        state: { filters },
        setAllFilters: jest.fn(),
      };
      const { container } = renderWithContext(contextValue);
      expect(container.firstChild).toHaveClass(props.className);
    });

    it('calls setAllFilters with empty array when clear button is clicked', () => {
      const setAllFilters = jest.fn();
      const contextValue = { headers, state: { filters }, setAllFilters };
      const { getByText } = renderWithContext(contextValue);
      const clearButton = getByText(props.clearFiltersText);
      clearButton.click();
      expect(setAllFilters).toHaveBeenCalledWith([]);
    });
  });
});
