import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { Flex, Box, Icon, Text } from "@chakra-ui/core";
import styled from "@emotion/styled";

const StyledLink = styled.a<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => (props.active ? "#f4f5f9" : "#dddfe6")};
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.active ? "#f4f5f9" : "transparent")};

  &:hover {
    color: #f4f5f9;
    border-bottom-color: #f4f5f9;
    border-bottom-width: 2px;
  }
`;

const Wrapper = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const NavStrip = (): JSX.Element => {
  const router = useRouter();

  return (
    <Wrapper>
      <Box width="100%" margin="0 auto" bg="primary.100">
        <Flex as="nav" justifyContent="center">
          <Flex marginRight="2rem" fontSize="1.25rem">
            <Link href="/dashboard" passHref>
              <StyledLink active={router.pathname === "/dashboard"}>
                <Icon name="dashboard" />
                <Text style={{ marginLeft: "0.25rem" }}>Dashboard</Text>
              </StyledLink>
            </Link>
          </Flex>
          <Flex marginRight="2rem" fontSize="1.25rem">
            <Link href="/markets" passHref>
              <StyledLink active={router.pathname === "/markets"}>
                <Icon name="markets" />
                <Text style={{ marginLeft: "0.25rem" }}>Markets</Text>
              </StyledLink>
            </Link>
          </Flex>

          <Flex marginRight="0" fontSize="1.25rem">
            <Link href="/account" passHref>
              <StyledLink active={router.pathname === "/account"}>
                <Icon name="account" />
                <Text style={{ marginLeft: "0.25rem" }}>Account</Text>
              </StyledLink>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Wrapper>
  );
};

export default NavStrip;
