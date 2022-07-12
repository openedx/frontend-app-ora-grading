import React from 'react';
import PropTypes from 'prop-types';
import { Button, DataTableContext } from '@edx/paragon';

import * as module from './FilterStatusComponent';

export const filterHooks = () => {
  const { state, setAllFilters, headers } = React.useContext(DataTableContext);
  if (!setAllFilters || !state.filters) {
    return {};
  }
  const clearFilters = React.useCallback(() => setAllFilters([]), [setAllFilters]);
  const headerMap = headers.reduce(
    (obj, cur) => ({ ...obj, [cur.id]: cur.Header }),
    {},
  );
  const filterNames = state.filters.map((filter) => headerMap[filter.id]);
  return { clearFilters, filterNames };
};

export const FilterStatusComponent = ({
  className,
  variant,
  size,
  clearFiltersText,
  buttonClassName,
  showFilteredFields,
}) => {
  const hookProps = module.filterHooks();
  if (hookProps.filterNames === undefined) {
    return null;
  }
  const filterTexts = <p>Filtered by {hookProps.filterNames.join(', ')}</p>;
  return (
    <div className={className}>
      {showFilteredFields && filterTexts}
      <Button
        className={buttonClassName}
        variant={variant}
        size={size}
        onClick={hookProps.clearFilters}
      >
        {clearFiltersText}
      </Button>
    </div>
  );
};

FilterStatusComponent.defaultProps = {
  className: '',
  buttonClassName: 'pgn__smart-status-button',
  variant: 'link',
  size: 'inline',
  clearFiltersText: 'Clear Filters',
  showFilteredFields: true,
};

FilterStatusComponent.propTypes = {
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  clearFiltersText: PropTypes.string,
  showFilteredFields: PropTypes.bool,
};

export default FilterStatusComponent;
