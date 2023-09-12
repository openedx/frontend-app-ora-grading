import { StrictDict } from 'utils';
// eslint-disable-next-line import/no-cycle
import app from './app';
import download from './download';
import grading from './grading';

export default StrictDict({
  app,
  download,
  grading,
});
