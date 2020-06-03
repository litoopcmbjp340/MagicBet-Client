import React from "react";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";

export default function Error(): JSX.Element {
  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="light.100"
      paddingBottom="1rem"
    >
      <Stack direction="column" alignItems="center">
        <Text fontSize="1.5rem">Something went wrong.</Text>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </Stack>
    </Flex>
  );
}
