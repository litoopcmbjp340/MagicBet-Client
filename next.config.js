const withImages = require("next-images");
module.exports = {
  reactStrictMode: true,
  assetPrefix: ".",
  env: {
    INFURA_KEY: process.env.INFURA_KEY,
    IPFS: process.env.IPFS === "true" ? "true" : "false",
  },
};

module.exports = withImages();
