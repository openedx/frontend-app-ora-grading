import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPanel } from '.';

function mockPlugin(name) {
  const fn = () => name;
  Object.defineProperty(fn, 'name', { value: name });
  fn.supportedTypes = [name];
  return fn;
}

jest.mock('./PDFRenderer', () => mockPlugin('PDFRenderer'));
jest.mock('./ImageRenderer', () => mockPlugin('ImageRenderer'));

describe('Preview Panel Component', () => {
  const props = {
    url: 'some_url.pdf',
  };

  let el;
  beforeEach(() => {
    el = shallow(<PreviewPanel {...props} />);
  });
  describe('snapshot', () => {
    test('default', () => {
      expect(el).toMatchSnapshot();
    });
    test('PDFRenderer', () => {
      el.setProps({
        fileName: 'file_name.PDFRenderer',
      });
      expect(el).toMatchSnapshot();
    });
    test('ImageRenderer', () => {
      el.setProps({
        fileName: 'file_name.ImageRenderer',
      });
      expect(el).toMatchSnapshot();
    });
  });

  describe('Component', () => {
    test('Test component render', () => {
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
});
