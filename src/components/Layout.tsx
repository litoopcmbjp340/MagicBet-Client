import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/core";

import Header from "./Header";
import NavStrip from "./NavStrip";
import { useBodyKeyDown } from "../hooks";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <>
      <Header />
      <NavStrip />
      <Box padding="1rem 0" width="100%" margin="0 auto">
        <Box width="100%" padding="0.75rem" minWidth="560px">
          <Box
            borderTopRightRadius="1rem"
            borderTopLeftRadius="1rem"
            backgroundColor="primary.100"
            height="0.5rem"
          />
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
