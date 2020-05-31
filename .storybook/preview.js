import React from "react";
import { addDecorator } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/utils/theme";
import { GlobalStyle } from "../src/index";
import StoryRouter from "storybook-react-router";

addDecorator(StoryRouter());

addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Story />
  </ThemeProvider>
));
