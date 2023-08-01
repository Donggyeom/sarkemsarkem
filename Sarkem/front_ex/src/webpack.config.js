// webpack.config.js

module.exports = {
    // ... 다른 설정들 ...
  
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  
    // ... 다른 설정들 ...
  };
  