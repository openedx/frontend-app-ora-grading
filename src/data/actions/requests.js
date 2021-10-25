import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'requests';
const createAction = createActionFactory(dataKey);

export const startRequest = createAction('startRequest');
export const completeRequest = createAction('completeRequest');
export const failRequest = createAction('failRequest');

export default StrictDict({
  startRequest,
  completeRequest,
  failRequest,
});
