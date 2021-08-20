import { createAction } from '@reduxjs/toolkit';

const createActionFactory = (dataKey) => (actionKey, ...args) => (
  createAction(`${dataKey}/${actionKey}`, ...args)
);

export {
  // eslint-disable-next-line import/prefer-default-export
  createActionFactory,
};
