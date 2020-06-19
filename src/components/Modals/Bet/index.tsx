import React, { useState, Suspense } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Flex,
  Tag,
  Stack,
  Button,
  Icon,
  Spinner,
  useColorMode,
} from '@chakra-ui/core';

import { useEthBalance, useTokenBalance } from 'hooks';
import { useTokens } from 'utils/tokens';
import { bgColor7 } from 'utils/theme';
import { mintDai } from 'utils';

const BetModal = ({ settingsModalToggle }: any): JSX.Element => {
  const [usingDai, setUsingDai] = useState<boolean>(true);
  const { colorMode } = useColorMode();

  const { account, library } = useWeb3React<Web3Provider>();

  const { data } = useEthBalance(account!, false);
  const tokens = useTokens();
  const daiToken = tokens[0][5];
  const { data: tokenData } = useTokenBalance(daiToken, account!, false);

  let wallet: any;
  if (!!library && !!account) wallet = library.getSigner(account);

  return (
    <Modal
      isOpen={settingsModalToggle.isOpen}
      onClose={settingsModalToggle.onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton onClick={settingsModalToggle.onClose} />
        <ModalBody>
          <Stack direction="column">
            <Stack direction="row" justify="space-between">
              <Button
                textTransform="uppercase"
                fontWeight="500"
                color="dark.100"
                backgroundColor="light.100"
                border="none"
                box-shadow="0 0.5rem 1rem rgba(0, 0, 0, 0.1)"
                transition="all 0.3s ease 0s"
                outline="none"
                cursor="pointer"
                my="1.25rem"
                type="button"
                _hover={{
                  backgroundColor: 'primary.100',
                  boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.3)',
                  color: 'light.100',
                  transform: 'translateY(-5px)',
                }}
                onClick={() => setUsingDai(!usingDai)}
              >
                {usingDai ? 'Dai' : 'Ether'}
              </Button>

              {usingDai ? (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  color="dark.100"
                >
                  <Tag>
                    <Suspense fallback={<Spinner />}>
                      {tokenData &&
                        tokenData.toSignificant(6, { groupSeparator: ',' })}
                    </Suspense>
                  </Tag>
                </Flex>
              ) : (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  color="dark.100"
                >
                  <Tag>
                    <Suspense fallback={<Spinner />}>
                      {data && data.toSignificant(4, { groupSeparator: ',' })}
                    </Suspense>
                  </Tag>
                </Flex>
              )}
            </Stack>
          </Stack>
          <Stack>
            <Button
              backgroundColor="primary.100"
              fontWeight="700"
              color="light.100"
              cursor="pointer"
              m="2rem"
              p="0"
              onClick={() => mintDai(wallet)}
            >
              <Icon name="daiIcon" color="white.200" size="1.5rem" />
            </Button>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={settingsModalToggle.onClose}>Okay</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BetModal;
