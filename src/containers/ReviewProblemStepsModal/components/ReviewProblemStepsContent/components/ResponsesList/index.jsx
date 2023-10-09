import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Col, Row, Button,
} from '@edx/paragon';
import {
  BsMicrosoft, FormatListBulleted,
} from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { actions, selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import Rubric from 'containers/Rubric';

import StartGradingButton from '../StartGradingButton';
import ResponseItem from './components/ResponseItem';
import messages from './messages';
import './ResponseList.scss';

const responsesList = [
  {
    id: 'adb123',
    title: 'Prompt 1',
    response:
      ' Demanding, but definitely doable. Social, but educational. A focused topic, but applicable skills. CS50 is the quintessential Harvard (and Yale!) course',
  },
  {
    id: 'dfg456',
    title: 'Prompt 2',
    response:
      ' Demanding, but definitely doable. Social, but educational. A focused topic, but applicable skills. CS50 is the quintessential Harvard (and Yale!) course',
  },
];

const ResponsesList = ({
  intl, showRubric, isLoaded, toggleShowRubric,
}) => {
  const [isFormatList, setIsFormatList] = useState(true);
  const toggleFormatList = (formatList) => setIsFormatList(formatList);
  const formatListClass = isFormatList ? 'list__active' : 'list__disabled';
  const formatGridClass = !isFormatList ? 'list__active' : 'list__disabled';
  return (
    <>
      <Row className="my-3">
        <Col xs={12} md={8} className="justify-content-center">
          <h3>{intl.formatMessage(messages.responsesDetailListTitle)}</h3>
        </Col>
        <Col xs={6} md={4} className="flex-row">
          <Button variant="tertiary" iconAfter={FormatListBulleted} className={`mb-2 mb-sm-0 ${formatListClass}`} onClick={() => toggleFormatList(true)}> </Button>
          <Button variant="tertiary" iconAfter={BsMicrosoft} className={`mb-2 mb-sm-0 ${formatGridClass}`} onClick={() => toggleFormatList(false)}> </Button>
          {isLoaded && (
          <>
            <Button variant="outline-primary mr-1" onClick={toggleShowRubric}>
              <FormattedMessage {...(showRubric ? messages.hideRubric : messages.showRubric)} />
            </Button>
            <StartGradingButton />
          </>
          )}
        </Col>
      </Row>
      <Row className="my-3 justify-content-center">
        {showRubric && <Rubric />}
      </Row>

      <div className="mt-4">
        {responsesList.map(({ id, ...responseData }) => <ResponseItem key={id} {...responseData} />)}
      </div>
    </>
  );
};

ResponsesList.defaultProps = {
  isLoaded: false,
};
ResponsesList.propTypes = {
  showRubric: PropTypes.bool.isRequired,
  toggleShowRubric: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool,
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  showRubric: selectors.app.showRubric(state),
  isLoaded: selectors.requests.isCompleted(state, { requestKey: RequestKeys.fetchSubmission }),
});

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ResponsesList));
