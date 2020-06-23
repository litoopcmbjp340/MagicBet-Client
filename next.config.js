const withImages = require('next-images');
const withPWA = require('next-pwa');

module.exports = {
  reactStrictMode: true,
  assetPrefix: '.',
  pwa: {
    dest: 'public',
  },
};

module.exports = withImages();
