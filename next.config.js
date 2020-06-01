const withImages = require("next-images");
module.exports = {
  reactStrictMode: true,
  assetPrefix: ".",
  env: {
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    IPFS: process.env.IPFS === "true" ? "true" : "false",
  },
};

module.exports = withImages();
