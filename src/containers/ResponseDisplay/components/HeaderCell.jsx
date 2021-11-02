import React from 'react';

import InfoPopover from 'components/InfoPopover';

/* eslint react/prop-types: 0 */
export const HeaderEllipsesCell = ({ value }) => (
  <div className="text-truncate">{value}</div>
);

/* eslint react/prop-types: 0 */
export const HeaderFileExtensionCell = ({ value = '' }) => {
  const extension = value.split('.')?.pop().toUpperCase();
  return <div className="text-truncate">{extension}</div>;
};

/* eslint react/prop-types: 0 */
export const HeaderInfoPopoverCell = ({ row }) => {
  const { original } = row;
  return (
    <InfoPopover>
      {Object.keys(original).map((key) => (
        <div key={key} className="help-popover-option">
          <strong>{key.toUpperCase()}</strong>
          <br />
          {original[key]}
        </div>
      ))}
    </InfoPopover>
  );
};

export default {
  HeaderEllipsesCell,
  HeaderFileExtensionCell,
  HeaderInfoPopoverCell,
};
