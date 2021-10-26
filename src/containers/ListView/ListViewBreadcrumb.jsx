import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ArrowBack, Launch } from '@edx/paragon/icons';
import { Hyperlink, Icon } from '@edx/paragon';

import selectors from 'data/selectors';
import { locationId } from 'data/constants/app';
import urls from 'data/services/lms/urls';

/**
 * <ListViewBreadcrumb />
 */
export const ListViewBreadcrumb = ({ courseId, oraName }) => (
  <>
    <Hyperlink className="py-4" destination={urls.openResponse(courseId)}>
      <Icon icon={ArrowBack} className="mr-3" />
      Back to all open responses
    </Hyperlink>
    <p className="h3 py-4">
      {oraName}
      <Hyperlink destination={urls.ora(courseId, locationId)} target="_blank">
        <Icon icon={Launch} />
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
