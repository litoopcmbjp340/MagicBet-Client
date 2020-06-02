const path = require("path");
module.exports = {
  stories: ["../src/components/**/*.stories.tsx"],
  // stories: ["../stories/**/*.stories.tsx"],
  addons: [
    {
      name: "@storybook/preset-typescript",
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, "../tsconfig.json"),
        },
      },
    },
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
    "@storybook/addon-viewport",
    "@storybook/addon-backgrounds",
    "@storybook/addon-storysource",
    "@storybook/addon-docs",
  ],
};
