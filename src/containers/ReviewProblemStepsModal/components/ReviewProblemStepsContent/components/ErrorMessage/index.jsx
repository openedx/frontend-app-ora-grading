import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';

export const ErrorMessage = ({ title, message }) => (
  <Alert
    variant="danger"
    icon={Info}
    stacked
  >
    <Alert.Heading data-testid="title-heading">{title}</Alert.Heading>
    <p data-testid="message">
      {message}
    </p>
  </Alert>
);

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
