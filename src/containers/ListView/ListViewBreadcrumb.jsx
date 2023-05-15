import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ArrowBack, Launch } from '@edx/paragon/icons';
import { Hyperlink, Icon } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { selectors } from 'data/redux';
import { locationId } from 'data/constants/app';
import urls from 'data/services/lms/urls';
import messages from './messages';

/**
 * <ListViewBreadcrumb />
 */
export const ListViewBreadcrumb = ({ courseId, oraName }) => (
  <>
    <Hyperlink className="py-4" destination={urls.openResponse(courseId)}>
      <Icon src={ArrowBack} className="d-inline-block mr-3 breadcrumb-arrow" />
      <FormattedMessage {...messages.backToResponses} />
    </Hyperlink>
    <p className="py-4">
      <span className="h3">{oraName}</span>
      <Hyperlink className="align-middle" destination={urls.ora(courseId, locationId())}>
        <Icon src={Launch} className="d-inline-block" />
      </Hyperlink>
    </p>
  </>
);
ListViewBreadcrumb.defaultProps = {
  courseId: '',
  oraName: '',
};
ListViewBreadcrumb.propTypes = {
  courseId: PropTypes.string,
  oraName: PropTypes.string,
};

export const mapStateToProps = (state) => ({
  courseId: selectors.app.courseId(state),
  oraName: selectors.app.ora.name(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListViewBreadcrumb);
