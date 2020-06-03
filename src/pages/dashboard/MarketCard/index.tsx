import React, { useState, useEffect, FormEvent, useContext } from "react";
import CountUp from "react-countup";
import CountDown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Button,
  Text,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Tag,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/core";
// import dynamic from "next/dynamic";

import Info from "components/Modals/Info";
//import Bet from "components/Modals/Bet";
import Chart from "./Chart";
import OwnerFunctionality from "./OwnerFunctionality";
import { shortenAddress } from "utils";
// useTokenAllowance
import { ModalContext } from "state/modals/Context";
//import { BetContext } from "state/bet/Context";
import { useEthBalance, useTokenBalance } from "hooks";
import { useTokens } from "utils/tokens";
import { bgColorModal, bgColorMc, colorMc } from "theme";

const MarketCard = ({ marketContract, daiContract }: any) => {
  const { active, account, library } = useWeb3React<Web3Provider>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  const toast = useToast();
  // const Chart = dynamic(() => import("./Chart"));
  const { modalState, modalDispatch } = useContext(ModalContext);

  const [amountToBet, setAmountToBet] = useState<number>(0);
  const [accruedInterest, setAccruedInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const MarketStates = ["SETUP", "WAITING", "OPEN", "LOCKED", "WITHDRAW"];
  const [marketState, setMarketState] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [choice, setChoice] = useState<string>("");
  const [outcomes, setOutcomes] = useState<any>([]);
  const [daiApproved, setDaiApproved] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [usingDai, setUsingDai] = useState<boolean>(true);
  const [slippage, setSlippage] = useState<number>(30);

  const { data } = useEthBalance(account!, false);
  const tokens = useTokens();
  const daiToken = tokens[0][5];
  const { data: tokenData } = useTokenBalance(daiToken, account!, false);

  //TODO: MOVE TO HOOK
  const [eventState, setEventState] = useState<any>();
  const [eventBet, setEventBet] = useState<any>();
  marketContract.on("StateChanged", (state: any) => setEventState(state));
  marketContract.on("ParticipantEntered", (address: any) =>
    setEventBet(address)
  );

  useEffect(() => {
    (async () => {
      if (marketContract) {
        const [
          _marketState,
          _owner,
          _marketResolutionTime,
          _eventName,
          _accruedInterest,
        ] = await Promise.all([
          marketContract.state(),
          marketContract.owner(),
          marketContract.marketResolutionTime(),
          marketContract.eventName(),
          marketContract.getTotalInterest(),
        ]);
        setMarketState(MarketStates[_marketState]);
        setOwner(_owner);
        setMarketResolutionTime(_marketResolutionTime);
        setPrompt(_eventName);
        const accIntFormatted = utils.formatEther(_accruedInterest);
        const val = parseFloat(accIntFormatted);
        setAccruedInterest(val);
      }
    })();
  }, [MarketStates, account, marketContract, eventState, eventBet]);

  useEffect(() => {
    (async () => {
      if (account && library && daiContract) {
        const getAllowance = async () => {
          return await daiContract.allowance(account, marketContract.address);
        };
        // const { data: _allowance } = useTokenAllowance(daiToken, account, marketContract.address)
        if (account) {
          getAllowance().then((allowance) => {
            if (allowance.toString() !== "0") setDaiApproved(true);
          });
        }
      }
    })();
  }, [account, daiContract, library, marketContract.address]);

  //TODO: CLEAN
  useEffect(() => {
    (async () => {
      const numberOfOutcomes = await marketContract.numberOfOutcomes();
      if (numberOfOutcomes.toNumber() !== 0) {
        const numberOfOutcomes = (
          await marketContract.numberOfOutcomes()
        ).toNumber();
        let newOutcomes = [];
        for (let i = 0; i < numberOfOutcomes; i++) {
          const outcomeName = await marketContract.outcomeNames(i);
          newOutcomes.push(outcomeName);
        }
        setOutcomes(newOutcomes);
      }
    })();
  }, [marketContract]);

  const placeBet = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const amountToBetMultiplied = amountToBet * 1000000000000000000;

    const balance = await daiContract!.balanceOf(account);

    if (balance < amountToBetMultiplied) {
      toast({
        title: "Insufficient Funds",
        description: "Add more Dai to wallet",
        status: "warning",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const indexOfChoice: number = outcomes.indexOf(choice);

    /* if (!daiApproved) {
      let balance = await daiContract.balanceOf(account);
      await daiContract.approve(marketContract.address, balance);
      setDaiApproved(true);
    } */

    const formatted = utils.parseUnits(amountToBet.toString(), 18);

    const increaseByFactor = (number: utils.BigNumber) =>
      number.mul(utils.bigNumberify(120)).div(utils.bigNumberify(100));

    const estimatedWei = await marketContract.getEstimatedETHforDAI(formatted);
    const estimatedWeiWithMargin = increaseByFactor(estimatedWei[0]);
    const estimatedGas = await marketContract.estimate.placeBet(
      indexOfChoice,
      formatted,
      { value: estimatedWeiWithMargin }
    );

    try {
      const tx = await marketContract.placeBet(indexOfChoice, formatted, {
        gasLimit: increaseByFactor(estimatedGas),
        value: estimatedWeiWithMargin,
      });

      toast({
        title: "Transaction Confirmed",
        description: `${shortenAddress(tx.hash)}`,
        status: "info",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });

      const result = await tx.wait();
      toast({
        title: "Transaction Success",
        description: `${shortenAddress(result.transactionHash)}`,
        status: "success",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
      setRerender(!rerender);
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction Failed",
        description: "Try increasing gas",
        status: "error",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const withdraw = async () => {
    try {
      const tx = await marketContract.withdraw();
      console.log(tx.hash);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const checkOwner = (): boolean => {
    if (owner !== null && account !== null) {
      if (account === null) return false;
      return account === owner;
    } else {
      return false;
    }
  };

  return !prompt ? null : (
    <>
      <Box bg={bgColorMc[colorMode]} borderRadius="0.5rem" margin="0 1.5rem">
        <Flex
          borderBottom="1px solid dark.100"
          alignItems="center"
          justifyContent="space-between"
          padding="0.5rem 1rem"
        >
          <Text>{shortenAddress(marketContract.address)}</Text>
          <Flex flexDirection="column" justifyContent="space-between" ml="2rem">
            <Text
              color="#555"
              font-size="12px"
              line-height="1.5"
              margin="0 0 10px"
              padding="0"
            >
              Current, Potential Winnings (in Dai)
            </Text>
            <Box textAlign="center">
              <CountUp
                start={0}
                end={accruedInterest}
                decimals={18}
                preserveValue={true}
                duration={10}
              />
            </Box>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex>
              <IconButton
                aria-label="market info"
                variant="ghost"
                icon="info"
                size="lg"
                pr={0.5}
                onClick={() =>
                  modalDispatch({
                    type: "TOGGLE_INFO_MODAL",
                    payload: !modalState.infoModalIsOpen,
                  })
                }
              />
              <IconButton
                aria-label="purchase settings"
                variant="ghost"
                icon="settings"
                size="lg"
                onClick={
                  onOpen
                  // modalDispatch({
                  //   type: "TOGGLE_BET_SETTINGS_MODAL",
                  //   payload: !modalState.betSettingsModalIsOpen,
                  // })
                }
              />
            </Flex>
            <Text width="5.5rem">
              {marketResolutionTime ? (
                <CountDown date={Date.now() + marketResolutionTime} />
              ) : (
                "-"
              )}
            </Text>
          </Flex>
        </Flex>
        <Heading as="h1" textAlign="center" fontSize="3rem">
          {prompt}
        </Heading>

        <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
          <Chart marketContract={marketContract} rerender={rerender} />

          {active && (
            <form onSubmit={placeBet}>
              <Flex flexDirection="column" justifyContent="center">
                <Select
                  width="auto"
                  height="3rem"
                  mt="1rem"
                  color="#777"
                  borderColor="secondary.100"
                  value={choice}
                  onChange={(e: any) => setChoice(e.target.value)}
                >
                  <option disabled value="" />
                  {outcomes.map((outcome: any) => (
                    <option key={outcome} value={outcome}>
                      {outcome}
                    </option>
                  ))}
                </Select>

                <Flex justifyContent="center">
                  <Input
                    borderStyle="none"
                    color={colorMc[colorMode]}
                    backgroundColor={bgColorMc[colorMode]}
                    fontSize="70px"
                    my="1"
                    py="3rem"
                    textAlign="center"
                    width="50%"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    onChange={(e: any) => setAmountToBet(e.target.value)}
                    onKeyDown={(e: any) =>
                      (e.key === "e" && e.preventDefault()) ||
                      (e.key === "+" && e.preventDefault()) ||
                      (e.key === "-" && e.preventDefault())
                    }
                  />
                </Flex>

                {!!(library && account) && (
                  <Flex justifyContent="center">
                    <Button
                      borderRadius="0.5rem"
                      cursor="pointer"
                      fontSize="1.33rem"
                      width="8rem"
                      border="2px solid primary.100"
                      color="light.100"
                      backgroundColor="primary.100"
                      type="submit"
                      _hover={{ bg: "dark.100" }}
                      isDisabled={
                        amountToBet <= 0 ||
                        marketState !== "OPEN" ||
                        choice === ""
                      }
                    >
                      Enter
                    </Button>
                    {marketState === "WITHDRAW" && (
                      <Button
                        cursor="pointer"
                        fontSize="1.33rem"
                        mt="1rem"
                        width="8rem"
                        border="1px"
                        borderColor="primary.100"
                        borderRadius="0.5rem"
                        color="primary.100"
                        backgroundColor="light.100"
                        type="button"
                        onClick={() => withdraw()}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Flex>
                )}
              </Flex>
            </form>
          )}
        </Flex>
        {checkOwner() && <OwnerFunctionality marketContract={marketContract} />}
      </Box>
      <Info isOpen={modalState.infoModalIsOpen} />
      {/* //TODO: MOVE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={bgColorModal[colorMode]} borderRadius="0.25rem">
          <ModalHeader>Bet Settings</ModalHeader>
          <ModalCloseButton />
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
                  <Flex justifyContent="center" alignItems="center">
                    {tokenData
                      ? tokenData.toSignificant(6, { groupSeparator: "," })
                      : "-"}
                  </Flex>
                ) : (
                  <Flex justifyContent="center" alignItems="center">
                    <Tag>
                      {data
                        ? data.toSignificant(4, { groupSeparator: "," })
                        : "-"}
                    </Tag>
                  </Flex>
                )}
              </Stack>
              <Stack direction="row" justify="space-between">
                <Text>SLIPPAGE</Text>
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
            <Button onClick={onClose}>Okay</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MarketCard;
