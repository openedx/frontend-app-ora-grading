import InfoPopover from '@src/components/InfoPopover/messages';
import ResponseDisplay from '@src/containers/ResponseDisplay/messages';
import ResponseDisplayComponents from '@src/containers/ResponseDisplay/components/messages';
import CriterionContainer from '@src/containers/CriterionContainer/messages';
import ListView from '@src/containers/ListView/messages';
import ReviewActions from '@src/containers/ReviewActions/messages';
import ReviewActionsComponents from '@src/containers/ReviewActions/components/messages';
import Rubric from '@src/containers/Rubric/messages';
import ReviewModal from '@src/containers/ReviewModal/messages';
import ReviewErrors from '@src/containers/ReviewModal/ReviewErrors/messages';
import lms from '@src/data/services/lms/messages';

const mapMessages = (messages) => Object.keys(messages).reduce(
  (acc, key) => ({ ...acc, [key]: messages[key].defaultMessage }),
  {},
);

export default {
  InfoPopover: mapMessages(InfoPopover),
  ResponseDisplay: mapMessages(ResponseDisplay),
  ResponseDisplayComponents: mapMessages(ResponseDisplayComponents),
  CriterionContainer: mapMessages(CriterionContainer),
  ListView: mapMessages(ListView),
  ReviewActions: mapMessages(ReviewActions),
  ReviewActionsComponents: mapMessages(ReviewActionsComponents),
  Rubric: mapMessages(Rubric),
  ReviewModal: mapMessages(ReviewModal),
  ReviewErrors: mapMessages(ReviewErrors),
  lms: mapMessages(lms),
};
