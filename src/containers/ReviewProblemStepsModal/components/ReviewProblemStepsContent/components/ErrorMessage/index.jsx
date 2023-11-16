import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

export const ErrorMessage = ({ title, message }) => (
  <Alert
    variant="danger"
    icon={Info}
    stacked
  >
    <Alert.Heading>{title}</Alert.Heading>
    <p>
      {message}
    </p>
  </Alert>
);

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
