const path = require("path");

module.exports = {
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'components': path.resolve(__dirname, "../components"),
      'helpers': path.resolve(__dirname, "../helpers"),
      'types': path.resolve(__dirname, "../types"),
      'const': path.resolve(__dirname, "../const"),
      'styles': path.resolve(__dirname, "../styles"),
    }
    return config;
  },
  "stories": [
    "../components/**/**/*.stories.mdx",
    "../components/**/*.stories.mdx",
    "../components/**/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          // When you have splitted your css over multiple files
          // and use @import('./other-styles.css')
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require('postcss'),
        },
      },
    },
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5"
  },
  "staticDirs": ['../public'],
}