/* eslint-disable import/prefer-default-export */
/**
 * mock components
 * @example mockStructuredComponents('Card', { Card: ['Body']})
 * @param {string[]} components
 * @param {map{string, string[]}} nestedComponents
 */
const mockStructuredComponents = (components = [], nestedComponents = {}) => {
  const mockResults = {};
  components.forEach(
    (component) => {
      const fn = () => component;
      // this is necessary to define arrow function a name.
      // Mock is using the function name to define the method.
      Object.defineProperty(fn, 'name', { value: component });
      mockResults[component] = fn;
    },
  );

  Object.keys(nestedComponents).forEach(component => {
    mockResults[component] = mockResults[component] || {};
    nestedComponents[component].forEach(
      (nestedComponent) => {
        mockResults[component][nestedComponent] = `${component}.${nestedComponent}`;
      },
    );
  });

  return mockResults;
};

/**
 * This method is helper for writing mock for paragon components.
 * Note: This assume paragon has only 2 level coomponent at most.
 * @example mockComponents('Card', 'Card.Body')
 * @param  {...string} args
 */
export const mockComponents = (...args) => {
  const components = [];
  const nestedComponents = {};

  args.forEach((component) => {
    if (component.includes('.')) {
      const [name, value] = component.split('.');
      nestedComponents[name] = nestedComponents[name] || [];
      nestedComponents[name].push(value);
    } else {
      components.push(component);
    }
  });

  return mockStructuredComponents(components, nestedComponents);
};
