const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace './src/index.js' with the entry file of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace 'dist' with the output directory for your bundled files
    filename: 'bundle.js', // Replace 'bundle.js' with the desired name of your bundled file
  },
  module: {
    rules: [
      {
        test: /\.ttf$/,
        use: [
          {
            loader: 'react-native-font-loader',
            options: {
              path: './assets/fonts', // Replace './assets/' with the path to your font files
            },
          },
        ],
      },
    ],
  },
};
