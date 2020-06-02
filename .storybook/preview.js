import React from "react";
import { addDecorator } from "@storybook/react";
// import { ThemeProvider } from "emotion-theming";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import theme, { GlobalStyle } from "../src/theme";

addDecorator((storyFn) => (
  <>
    {/* <CSSReset /> */}
    {/* <GlobalStyle /> */}
    {storyFn()}
  </>
));
