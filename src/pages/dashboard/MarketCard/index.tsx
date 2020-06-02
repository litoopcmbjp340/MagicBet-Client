import React, { useState, useEffect, FormEvent } from "react";
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
  useDisclosure,
  useToast,
} from "@chakra-ui/core";
// import dynamic from "next/dynamic";
import styled from "@emotion/styled";

import Info from "components/Modals/Info";
import Chart from "./Chart";
import { shortenAddress } from "utils";
import {
  useETHBalance,
  useTokenBalance,
  useTokenAllowance,
} from "hooks/useBalance";
import { useTokens } from "utils/tokens";

const GraphWrapper = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

const MarketCard = ({ marketContract, daiContract }: any) => {
  const { active, account, library } = useWeb3React<Web3Provider>();
  const { data } = useETHBalance(account!, false);
  const tokens = useTokens();
  const daiToken = tokens[0][5];
  const { data: tokenData } = useTokenBalance(daiToken, account!, false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const Chart = dynamic(() => import("./Chart"));

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
  const [forceRerender, setRerender] = useState<boolean>(false);
  const [usingDai, setUsingDai] = useState<boolean>(true);

  const [eventState, setEventState] = useState();
  const [eventBet, setEventBet] = useState();
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
      let numberOfOutcomes = await marketContract.numberOfOutcomes();
      if (numberOfOutcomes.toNumber() !== 0) {
        let numberOfOutcomes = (
          await marketContract.numberOfOutcomes()
        ).toNumber();
        let newOutcomes = [];
        for (let i = 0; i < numberOfOutcomes; i++) {
          let outcomeName = await marketContract.outcomeNames(i);
          newOutcomes.push(outcomeName);
        }
        setOutcomes(newOutcomes);
      }
    })();
  }, [marketContract]);

  const placeBet = async (e: FormEvent) => {
    e.preventDefault();

    let amountToBetMultiplied = amountToBet * 1000000000000000000;

    let balance = await daiContract!.balanceOf(account);

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

    let indexOfChoice: number = outcomes.indexOf(choice);

    /* if (!daiApproved) {
      let balance = await daiContract.balanceOf(account);
      await daiContract.approve(marketContract.address, balance);
      setDaiApproved(true);
    } */

    let formatted = utils.parseUnits(amountToBet.toString(), 18);

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
      let tx = await marketContract.placeBet(indexOfChoice, formatted, {
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

      let result = await tx.wait();
      toast({
        title: "Transaction Success",
        description: `${shortenAddress(result.transactionHash)}`,
        status: "success",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
      setRerender(!forceRerender);
    } catch (error) {
      console.error(error);
      // toast({
      //   title: "Transaction Failed",
      //   description: "Try increasing gas",
      //   status: "error",
      //   position: "bottom",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

  const withdraw = async () => {
    try {
      let tx = await marketContract.withdraw();
      console.log(tx.hash);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const checkOwner = () => {
    if (owner !== null && account !== null) {
      if (account === null) return false;
      return account === owner;
    } else {
      return false;
    }
  };

  return !prompt ? null : (
    <>
      <Box
        backgroundColor="secondary.100"
        borderRadius="0.5rem"
        margin="0 1.5rem"
      >
        <Flex
          borderBottom="1px solid dark.100"
          alignItems="center"
          justifyContent="space-between"
          padding="0.5rem 1rem"
        >
          <span>{shortenAddress(marketContract.address)}</span>
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
          <Flex alignItems="center" justifyContent="center">
            <Text width="5.5rem">
              {marketResolutionTime ? (
                <CountDown date={Date.now() + marketResolutionTime} />
              ) : (
                "-"
              )}
            </Text>
            <IconButton
              aria-label="market info"
              icon="info"
              size="lg"
              onClick={() => onOpen()}
            />
          </Flex>
        </Flex>
        <Heading as="h1" textAlign="center" fontSize="3rem">
          {prompt}
        </Heading>
        <Flex justifyContent="center" margin="0">
          <GraphWrapper>
            <Flex flexGrow={3}>
              <Chart
                marketContract={marketContract}
                forceRerender={forceRerender}
              />
            </Flex>
          </GraphWrapper>
          {active && (
            <form onSubmit={placeBet}>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                flexGrow={1}
                ml="2rem"
                mt="1rem"
              >
                <Select
                  width="50%"
                  height="3rem"
                  margin="0"
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

                <Button
                  textTransform="uppercase"
                  fontWeight="500"
                  color="#777"
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
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  {usingDai ? (
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      color="dark.100"
                      fontSize="1.25rem"
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
                      fontSize="1.25rem"
                    >
                      {data
                        ? data.toSignificant(4, { groupSeparator: "," })
                        : "-"}
                    </Flex>
                  )}

                  <Input
                    borderStyle="none"
                    backgroundColor="secondary.100"
                    color="dark.100"
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
                  <>
                    <Button
                      borderBottomRightRadius="0.5rem"
                      borderTopRightRadius="0.5rem"
                      borderBottomLeftRadius="0.5rem"
                      borderTopLeftRadius="0.5rem"
                      cursor="pointer"
                      fontSize="1.33rem"
                      width="8rem"
                      border="2px solid primary.100"
                      color="light.100"
                      backgroundColor="primary.100"
                      type="submit"
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
                  </>
                )}
              </Flex>
            </form>
          )}
        </Flex>
        {checkOwner() && (
          <Flex justifyContent="center" flexDirection="column" mt="1rem">
            <Button
              my="0.25rem"
              backgroundColor="dark.100"
              color="light.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "primary.100" }}
              onClick={async () => await marketContract.incrementState()}
            >
              Increment Market State
            </Button>
            <Button
              my="0.25rem"
              backgroundColor="dark.100"
              color="light.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "primary.100" }}
              onClick={async () => await marketContract.determineWinner()}
            >
              Get Winner from Oracle
            </Button>
            <Button
              my="0.25rem"
              backgroundColor="dark.100"
              color="light.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "primary.100" }}
              onClick={async () => await marketContract.disableContract()}
            >
              Pause (Disable) Contract
            </Button>
          </Flex>
        )}
      </Box>
      <Info isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default MarketCard;
