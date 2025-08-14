import { render, fireEvent } from '@testing-library/react';
import { InfoPopover } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Info Popover Component', () => {
  const child = <div>Children component</div>;
  const onClick = jest.fn().mockName('this.props.onClick');

  describe('Component', () => {
    it('renders the help icon button', () => {
      const { getByTestId } = render(
        <InfoPopover onClick={onClick}>
          {child}
        </InfoPopover>,
      );
      expect(getByTestId('esg-help-icon')).toBeInTheDocument();
    });

    it('calls onClick when the help icon is clicked', () => {
      const { getByTestId } = render(
        <InfoPopover onClick={onClick}>
          {child}
        </InfoPopover>,
      );
      fireEvent.click(getByTestId('esg-help-icon'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
