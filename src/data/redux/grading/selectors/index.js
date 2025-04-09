import { StrictDict } from '@src/utils';
import base from './base';
import selected from './selected';
import nav from './nav';
import validation from './validation';

export default StrictDict({
  ...base,
  ...nav,
  selected,
  validation,
});
