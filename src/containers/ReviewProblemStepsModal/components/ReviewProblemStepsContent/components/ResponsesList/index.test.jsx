import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from 'testUtils';
import messages from './messages';
import { ResponsesList } from '.';

describe('ResponsesList component', () => {
  const mockToggleShowRubric = jest.fn();

  const defaultProps = {
    showRubric: false,
    toggleShowRubric: mockToggleShowRubric,
    isLoaded: true,
  };

  let el;

  beforeEach(() => {
    el = shallow(<ResponsesList intl={{ formatMessage }} {...defaultProps} />);
  });

  it('renders without crashing', () => {
    expect(el.exists()).toBe(true);
  });

  it('renders the correct title', () => {
    const h3Title = el.find('h3');
    expect(h3Title.text()).toBe(
      formatMessage(messages.responsesDetailListTitle),
    );
  });

  it('list ordered button and list-grid-button must be rendered', () => {
    const formatListOrderedButton = el.find(
      '[data-testid="list-ordered-button"]',
    );
    expect(formatListOrderedButton.exists()).toBe(true);
    const formatListGridButton = el.find('[data-testid="list-grid-button"]');
    expect(formatListGridButton.exists()).toBe(true);
  });

  it('When has isLoaded prop should show "Show Rubric" button" ', () => {
    const showRubricButton = el.find('[data-testid="show-rubric-button"]');
    expect(showRubricButton.exists()).toBe(true);
  });

  it('renders the list of responses', () => {
    const responsesList = [
      {
        id: 'adb123',
        title: 'Prompt 1',
        response:
          ' Demanding, but definitely doable. Social, but educational. A focused topic, but applicable skills. CS50 is the quintessential Harvard (and Yale!) course',
      },
      {
        id: 'dfg456',
        title: 'Prompt 2',
        response:
          ' Demanding, but definitely doable. Social, but educational. A focused topic, but applicable skills. CS50 is the quintessential Harvard (and Yale!) course',
      },
    ];

    const wrapper = shallow(<ResponsesList intl={{ formatMessage }} {...defaultProps} responsesList={responsesList} />);

    responsesList.forEach((response) => {
      const responseItem = wrapper.find(`ResponseItem[title="${response.title}"][response="${response.response}"]`);
      expect(responseItem.exists()).toBe(true);
    });
  });
});
