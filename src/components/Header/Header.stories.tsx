import React from "react";
import Header from ".";
// import { action } from "@storybook/addon-actions";

export default {
  component: Header,
  title: "Header",
  excludeStories: /.*Data$/,
};

// export const actionsData = {
//   onPinTask: action("onPinTask"),
//   onArchiveTask: action("onArchiveTask"),
// };

export const Default = () => <Header />;

// export const Clicked = () => <Header {...actionsData} />;
