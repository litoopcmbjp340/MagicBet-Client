import React from "react";
import { storiesOf } from "@storybook/react";
import NavStrip from "./index";

// export default {
//   component: NavStrip,
//   title: "NavStrip",
//   excludeStories: /.*Data$/,
// };

// export const Default = () => <NavStrip />;

storiesOf("NavStrip", module).add("NavStrip", () => {
  return <NavStrip />;
});
