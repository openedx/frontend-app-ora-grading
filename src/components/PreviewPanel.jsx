import React from 'react';
import PropTypes from 'prop-types';

//import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'; // avoid import worker directly
//import DocViewer, { DocViewRenderers } from 'react-doc-viewer';
import FileViewer from 'react-file-viewer';

import {
  Icon,
  Form,
  ActionRow,
  IconButton,
} from '@edx/paragon';
import { ChevronLeft, ChevronRight } from '@edx/paragon/icons';

/**
 * <PreviewPanel />
 */
const  PreviewPanel = (props) => {
  //console.log('DEBUG : ' + props.src);
  const docs = [ {uri: props.src } ];
  console.log('DEBUG : ' + docs[0]);
  return (
    <div>
      <FileViewer fileType="pdf" filePath={props.src} />
    </div>
  );
}

export default PreviewPanel;
