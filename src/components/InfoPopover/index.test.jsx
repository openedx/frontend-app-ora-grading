import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../testUtils';
import { InfoPopover } from '.';

describe('Info Popover Component', () => {
  const child = <div>Children component</div>;
  const onClick = jest.fn().mockName('this.props.onClick');

  describe('Component', () => {
    it('renders the help icon button', () => {
      renderWithIntl(
        <InfoPopover onClick={onClick}>
          {child}
        </InfoPopover>,
      );
      expect(screen.getByTestId('esg-help-icon')).toBeInTheDocument();
    });

    it('calls onClick when the help icon is clicked', async () => {
      renderWithIntl(
        <InfoPopover onClick={onClick}>
          {child}
        </InfoPopover>,
      );
      const user = userEvent.setup();
      await user.click(screen.getByTestId('esg-help-icon'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
