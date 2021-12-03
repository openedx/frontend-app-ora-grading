import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPanel } from '.';

jest.mock('react-doc-viewer', () => ({
  __esModule: true,
  default: 'DocViewer',
  BMPRenderer: jest.fn().mockName('BMPRenderer'),
  ImageProxyRenderer: jest.fn().mockName('ImageProxyRenderer'),
  JPGRenderer: jest.fn().mockName('JPGRenderer'),
  PDFRenderer: jest.fn().mockName('PDFRenderer'),
  PNGRenderer: jest.fn().mockName('PNGRenderer'),
  TIFFRenderer: jest.fn().mockName('TIFFRenderer'),
  TXTRenderer: jest.fn().mockName('TXTRenderer'),
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
