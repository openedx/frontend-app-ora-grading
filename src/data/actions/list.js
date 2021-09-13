import { StrictDict } from 'utils';
import { createActionFactory } from './utils';

export const dataKey = 'list';
const createAction = createActionFactory(dataKey);

export default StrictDict({
  load: createAction('load'),
  updateSelection: createAction('updateSelection'),
});
