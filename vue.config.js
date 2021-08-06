module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vnodes/'
    : '/',
    devServer: {
      host: '192.168.1.64',
    }
}
