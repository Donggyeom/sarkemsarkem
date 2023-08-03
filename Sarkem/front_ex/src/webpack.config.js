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
    devServer: {
      // ... 다른 옵션들 ...
      host: '0.0.0.0',
      https: false,
      port: 8081,
      public: 'http://0.0.0.0:8081'
    },
  
    // ... 다른 설정들 ...
  };
  