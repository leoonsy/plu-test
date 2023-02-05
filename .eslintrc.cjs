/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'vue/multi-word-component-names': 'off',
  },
};
