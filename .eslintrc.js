const { createConfig } = require('@edx/frontend-build');

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
});

config.settings = {
  "import/resolver": {
    node: {
      paths: ["src", "node_modules"],
      extensions: [".js", ".jsx"],
    },
  },
};

module.exports = config;
