import _ from 'lodash';

/**
 * Recursively converts keys of an object (or elements of an array) from snake_case to camelCase.
 * @param {Object|Array} obj - The object or array to be transformed.
 * @returns {Object|Array} - The transformed object or array with camelCase keys or elements.
 */
export const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [_.camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};
