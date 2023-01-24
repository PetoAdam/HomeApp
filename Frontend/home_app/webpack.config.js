const path = require('path');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],
};
