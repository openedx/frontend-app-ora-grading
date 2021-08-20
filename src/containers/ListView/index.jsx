import React from 'react';
import { connect } from 'react-redux';

/**
 * <ListView />
 */
export const ListView = () => (
  <div id="ora-esg-list-view" />
);
ListView.defaultProps = {};
ListView.propTypes = {};

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
