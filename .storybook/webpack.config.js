const path = require('path');
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          configFile: path.resolve(__dirname, '../stories/tsconfig.json'),
        },
      },
    ],
  });
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
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
    enforce: 'pre',
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias['react-rxdi'] = path.resolve(__dirname, '../src');
  return config;
};
