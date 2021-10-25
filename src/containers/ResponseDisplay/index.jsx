import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Collapsible, Button, Icon, DataTable } from '@edx/paragon';
import { Download, ArrowDropDown, ArrowDropUp } from '@edx/paragon/icons';

import createDOMPurify from 'dompurify';

import parse from 'html-react-parser';

import selectors from 'data/selectors';

import './ResponseDisplay.scss';

/**
 * <ResponseDisplay />
 */
export class ResponseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.purify = createDOMPurify(window);
  }

  get textContent() {
    return parse(this.purify.sanitize(this.props.response.text));
  }

  get submittedFiles() {
    return this.props.response.files;
  }

  get hasResponse() {
    return this.props.response !== undefined;
  }

  render() {
    return (
      <div className='response-display'>
        <Card className='submission-files'>
          {this.submittedFiles.length ? (
            <Collapsible.Advanced defaultOpen>
              <Collapsible.Trigger className='submission-files-title'>
                <h3>Attached Files ({this.submittedFiles.length})</h3>
                <Collapsible.Visible whenClosed><Icon src={ArrowDropDown} /></Collapsible.Visible>
                <Collapsible.Visible whenOpen><Icon src={ArrowDropUp} /></Collapsible.Visible>
              </Collapsible.Trigger>

              <Collapsible.Body className='submission-files-body'>
                <DataTable
                  rowHeaderColumnKey='test'
                  columns={[
                    {
                      Header: 'Name',
                      accessor: 'fileName',
                    },
                    {
                      Header: 'Type',
                      accessor: 'fileType',
                    },
                    {
                      Header: 'Size',
                      accessor: 'fileSize',
                    },
                  ]}
                  data={this.submittedFiles}
                >
                  <DataTable.Table />
                </DataTable>
              </Collapsible.Body>
              <div className="submission-files-footer">
                <Button>Download Files <Icon src={Download} /></Button>
              </div>
            </Collapsible.Advanced>
          ) : (
            <div className='submission-files-title disabled'>
              <h3>No Attached Files Founded</h3>
            </div>
          )}
        </Card>
        <Card>
          {this.hasResponse && <Card.Body>{this.textContent}</Card.Body>}
        </Card>
      </div>
    );
  }
}

ResponseDisplay.defaultProps = {
  response: {
    text: '',
    files: [],
  },
};
ResponseDisplay.propTypes = {
  response: PropTypes.shape({
    text: PropTypes.string,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export const mapStateToProps = (state) => ({
  response: selectors.grading.selected.response(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDisplay);
