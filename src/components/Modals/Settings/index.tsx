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
  Flex,
  Tag,
  Stack,
  Button,
  Icon,
  Spinner,
  useColorMode,
} from '@chakra-ui/core';

import { useEthBalance, useTokenBalance } from '../../../hooks';
import { useTokens } from '../../../utils/tokens';
import { bgColor7 } from '../../../utils/theme';
import { mintDai } from '../../../utils';

const SettingsModal = ({ settingsModalToggle }: any): JSX.Element => {
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
                cursor="pointer"
                border="2px solid primary.100"
                color="light.100"
                backgroundColor="primary.100"
                type="button"
                // _hover={{ bg: 'dark.100' }}
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
            <Button
              bg="primary.100"
              fontWeight="700"
              color="light.100"
              cursor="pointer"
              mx="4rem"
              p="0"
              onClick={() => mintDai(wallet)}
            >
              <Icon name="daiIcon" color="white.200" size="1.5rem" />
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
