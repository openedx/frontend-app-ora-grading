import React from 'react';
import { shallow } from 'enzyme';

import { PreviewDisplay } from './PreviewDisplay';

jest.mock('components/PreviewPanel', () => {
  const PreviewPanel = () => 'PreviewPanel';
  PreviewPanel.isSupported = jest.fn().mockImplementation(value => value);
  return PreviewPanel;
});

describe('PreviewDisplay', () => {
  describe('component', () => {
    const props = {
      files: [
        {
          name: 'some file name.jpg',
          description: 'description for the file',
          downloadURL: '/valid-url-wink-wink.jpg',
        },
        {
          name: 'file number 2.pdf',
          description: 'description for this file',
          downloadURL: '/url-2.pdf',
        },
      ],
    };
    let el;
    beforeEach(() => {
      el = shallow(<PreviewDisplay {...props} />);
    });

    describe('snapshot', () => {
      test('files does not exist', () => {
        expect(el).toMatchSnapshot();
      });
      test('files exited for props', () => {
        el.setProps({ files: [] });
        expect(el).toMatchSnapshot();
      });
    });

    describe('component', () => {
      test('title', () => {
        const titleEls = el.find('.submission-files-title');
        expect(titleEls.length).toEqual(props.files.length);
        titleEls.forEach((titleEl, index) => {
          expect(titleEl.text()).toEqual(props.files[index].name);
        });
      });
    });
  });
});
