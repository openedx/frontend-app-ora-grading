import React from 'react';
import PropTypes from 'prop-types';

export const CourseLabel = ({
  courseOrg,
  courseNumber,
  courseTitle,
}) => (
  <div
    className="flex-grow-1 course-title-lockup"
    style={{ lineHeight: 1 }}
  >
    <span className="d-block small m-0">
      {courseOrg} {courseNumber}
    </span>
    <span className="d-block m-0 font-weight-bold course-title">
      {courseTitle}
    </span>
  </div>
);
CourseLabel.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
};
CourseLabel.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
};

export default CourseLabel;
