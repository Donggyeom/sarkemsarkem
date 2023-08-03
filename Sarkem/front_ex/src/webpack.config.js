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
      port: 3000,
    liveReload: true,
    // host 지정
    host: "0.0.0.0",
    allowedHosts: "all",
    open: true,
    client: {
      overlay: true,
      // 웹소켓용 url 지정
      webSocketURL: "ws://0.0.0.0:80/ws",
    },
    compress: true,
    },
  
    // ... 다른 설정들 ...
  };
  