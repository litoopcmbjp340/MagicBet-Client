import React, { useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  Text,
  Button,
} from "@chakra-ui/core";

import { ModalContext } from "state/modals/Context";
import { useEthBalance, useTokenBalance } from "hooks";
import { useTokens } from "utils/tokens";

const BetModal = ({ isOpen }: { isOpen: boolean }): JSX.Element => {
  const [usingDai, setUsingDai] = useState<boolean>(true);
  const [slippage, setSlippage] = useState<number>(30);

  const { modalState, modalDispatch } = useContext(ModalContext);

  const { account } = useWeb3React<Web3Provider>();

  const { data } = useEthBalance(account, false);
  const tokens = useTokens();
  const daiToken = tokens[0][5];
  const { data: tokenData } = useTokenBalance(daiToken, account, false);

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="light.100" borderRadius="0.25rem">
        <ModalHeader>Bet Settings</ModalHeader>
        <ModalCloseButton
          onClick={() =>
            modalDispatch({
              type: "TOGGLE_BET_SETTINGS_MODAL",
              payload: !modalState.betSettingsModalIsOpen,
            })
          }
        />
        <ModalBody>
          <Stack direction="column">
            {" "}
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
                  backgroundColor: "primary.100",
                  boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3)",
                  color: "light.100",
                  transform: "translateY(-5px)",
                }}
                onClick={() => setUsingDai(!usingDai)}
              >
                {usingDai ? "Dai" : "Ether"}
              </Button>

              {usingDai ? (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  color="dark.100"
                >
                  {tokenData
                    ? tokenData.toSignificant(6, { groupSeparator: "," })
                    : "-"}
                </Flex>
              ) : (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  color="dark.100"
                >
                  <Tag>
                    {data
                      ? data.toSignificant(4, { groupSeparator: "," })
                      : "-"}
                  </Tag>
                </Flex>
              )}
            </Stack>
            <Stack direction="row" justify="space-between">
              <Text color="dark.100">SLIPPAGE</Text>
              <Stack
                direction="column"
                spacing={0}
                alignItems="flex-end"
                w="50%"
                flexShrink={0}
              >
                <Slider
                  min={0}
                  max={100 * 4}
                  step={10}
                  color="red"
                  value={slippage}
                  onChange={setSlippage}
                >
                  <SliderTrack />
                  <SliderFilledTrack />
                  <SliderThumb />
                </Slider>
                <Stack direction="row" minHeight="1.5rem">
                  <Text>
                    {(slippage / 100).toFixed(slippage === 0 ? 0 : 1)}%
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() =>
              modalDispatch({
                type: "TOGGLE_BET_SETTINGS_MODAL",
                payload: !modalState.betSettingsModalIsOpen,
              })
            }
          >
            Okay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BetModal;
