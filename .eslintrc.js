module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {},
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'max-len': 'off',
        "linebreak-style": 0,
      },
    },
  ],
};
