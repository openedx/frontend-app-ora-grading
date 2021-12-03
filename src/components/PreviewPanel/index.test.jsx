import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPanel } from '.';

jest.mock('react-doc-viewer', () => ({
  __esModule: true,
  default: 'DocViewer',
  BMPRenderer: 'BMPRenderer',
  ImageProxyRenderer: 'ImageProxyRenderer',
  JPGRenderer: 'JPGRenderer',
  PDFRenderer: 'PDFRenderer',
  PNGRenderer: 'PNGRenderer',
  TIFFRenderer: 'TIFFRenderer',
  TXTRenderer: 'TXTRenderer',
}));

describe('Preview Panel Component', () => {
  const props = {
    uri: 'some_url.pdf',
  };

  let el;
  beforeEach(() => {
    el = shallow(<PreviewPanel {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('Component', () => {
    test('Test component render', () => {
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
});
