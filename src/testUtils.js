// eslint-disable-next-line import/prefer-default-export
export const formatMessage = (msg, values) => {
  let message = msg.defaultMessage;
  if (values === undefined) { return message; }
  Object.keys(values).forEach(key => {
    // eslint-disable-next-line
    message = message.replace(`{${key}}`, values[key]);
  });
  return message;
};
