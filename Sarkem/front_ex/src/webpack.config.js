// webpack.config.js

module.exports = {
    // ... 다른 설정들 ...
  
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/node_modules/,
          /\/node_modules\/face-api.*/
                    ],
          use: {
            loader: ['babel-loader',
            require.resolve('source-map-loader')
          ],
          },
        },
      ],
    },
  
    // ... 다른 설정들 ...
  };
  