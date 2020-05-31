import React from "react";
import { Flex, Stack, Text, Button } from "@chakra-ui/core";

export default function Error() {
  return (
    <Flex flexGrow={1} alignItems="center" justifyContent="center">
      <Stack direction="column" alignItems="center">
        <Text fontSize="1.5rem">Something went wrong.</Text>
        <Text>
          Try checking your internet connection, refreshing the page, or
          visiting from a different browser.
        </Text>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </Stack>
    </Flex>
  );
}
