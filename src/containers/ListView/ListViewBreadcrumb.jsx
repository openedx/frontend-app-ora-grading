import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ArrowBack } from '@edx/paragon/icons';
import { Hyperlink } from '@edx/paragon';

import selectors from 'data/selectors';
import { locationId } from '../../data/constants/app';

/**
 * <ListViewBreadcrumb />
 */
export const ListViewBreadcrumb = ({ courseId, oraName }) => {
  const openResponseUrl = `${process.env.LMS_BASE_URL}/courses/${courseId}/instructor#view-open_response_assessment`;
  const oraUrl = `${process.env.LMS_BASE_URL}/courses/${courseId}/jump_to/${locationId}`;
  return (
    <>
      <Hyperlink className="py-4" destination={openResponseUrl}>
        <ArrowBack className="mr-3" />
        Back to all open responses
      </Hyperlink>
      <p className="h3 py-4">{oraName}<Hyperlink
        destination={oraUrl}
        target="_blank"
      />
      </p>
    </>
  );
};
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
  oraName: selectors.app.oraName(state),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ListViewBreadcrumb);
