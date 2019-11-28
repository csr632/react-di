const path = require('path');
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.s\.tsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: {
          parser: 'typescript',
          prettierConfig: {
            trailingComma: 'es5',
            semi: true,
            singleQuote: true,
          },
        },
      },
    ],
    exclude: [/node_modules/],
    enforce: 'pre',
  });
  config.resolve.alias['react-rxdi'] = path.resolve(__dirname, '../src');
  return config;
};
