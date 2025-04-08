// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint', {
  rules: {
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-import-module-exports': 'off',
    'import/no-self-import': 'off',
    'spaced-comment': ['error', 'always', { 'block': { 'exceptions': ['*'] } }],
    'react-hooks/rules-of-hooks': 'off',
    "react/forbid-prop-types": ["error", { "forbid": ["any", "array"] }], // arguable object proptype is use when I do not care about the shape of the object
    'no-import-assign': 'off',
    'no-promise-executor-return': 'off',
    'import/no-cycle': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.prod.config.js',
      },
    },
  }
});

module.exports = config;
