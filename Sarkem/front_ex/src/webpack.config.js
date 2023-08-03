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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  
    // ... 다른 설정들 ...
  };
  