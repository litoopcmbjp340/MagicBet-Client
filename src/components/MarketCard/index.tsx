import React, { useState, useEffect, FormEvent } from "react";
import CountUp from "react-countup";
import CountDown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { utils, Contract } from "ethers";
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Switch,
  Input,
  Button,
  Text,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/core";

import Info from "components/Modals/Info";
import Chart from "./Chart";

import { shortenAddress } from "utils";
import dynamic from "next/dynamic";

import styled from "@emotion/styled";

const Form = styled.form`
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const Option = styled.option`
  color: black.100;
  background: white.100;
  display: flex;
  min-height: 2rem;
  padding: 0px 2px 1px;
  cursor: pointer;
`;

const SelectCurrency = styled.select`
  width: 25%;
  margin-top: 1rem;
  border-radius: 1rem;
  white-space: normal;
  background-color: transparent;
  color: black.100;
  font-size: 1rem;
  border: 1px solid gray.100;
  outline: none;
`;

const MarketCard = ({ marketContract, daiContract }: any) => {
  const { active, account, library } = useWeb3React<Web3Provider>();
  const toast = useToast();
  // const Chart = dynamic(() => import("./Chart.txt"));

  const [amountToBet, setAmountToBet] = useState<number>(0);
  const [accruedInterest, setAccruedInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const MarketStates = ["SETUP", "WAITING", "OPEN", "LOCKED", "WITHDRAW"];
  const [marketState, setMarketState] = useState<string>("");
  const [prompt, setPrompt] = useState<any>("");
  const [owner, setOwner] = useState<string>("");
  const [choice, setChoice] = useState<string>("");
  const [outcomes, setOutcomes] = useState<any>([]);
  const [daiApproved, setDaiApproved] = useState<boolean>(false);
  const [forceRerender, setRerender] = useState<boolean>(false);
  const [etherBalance, setEtherBalance] = useState<any>();
  const [daiBalance, setDaiBalance] = useState<any>();
  const [usingDai, setUsingDai] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  //!FOR EVENTS
  //const [eventState, setEventState] = useState();
  //const [eventBet, setEventBet] = useState();
  // marketContract.on("StateChanged", (state: any) => setEventState(state));
  // marketContract.on("ParticipantEntered", (address: any) =>
  //   setEventBet(address)
  // );

  useEffect(() => {
    (async () => {
      if (marketContract) {
        const marketState = await marketContract.state();
        setMarketState(MarketStates[marketState]);
        const owner = await marketContract.owner();
        setOwner(owner);
        const marketResolutionTime = await marketContract.marketResolutionTime();
        setMarketResolutionTime(marketResolutionTime);
        const eventName = await marketContract.eventName();
        setPrompt(eventName);
        const accruedInterest = await marketContract.getTotalInterest();
        const accIntFormatted = utils.formatEther(accruedInterest.toNumber());
        setAccruedInterest(parseFloat(accIntFormatted));
      }
    })();
  }, [MarketStates, account, marketContract]);

  useEffect(() => {
    (async () => {
      if (account && library && daiContract) {
        library
          .getBalance(account)
          .then((etherBalance: { toString: () => string }) => {
            let formattedEther = utils.formatUnits(etherBalance.toString(), 18);
            let formattedEtherBalance = parseFloat(formattedEther);
            setEtherBalance(formattedEtherBalance.toFixed(2));
          });

        let daiBalance = await daiContract.balanceOf(account);
        let formattedDai = utils.formatUnits(daiBalance, 18);
        setDaiBalance(formattedDai);
        const getAllowance = async () => {
          return await daiContract.allowance(account, marketContract.address);
        };
        if (account) {
          getAllowance().then((allowance) => {
            if (allowance.toString() !== "0") setDaiApproved(true);
          });
        }
      }
    })();
  }, [account, daiContract, library, marketContract.address]);

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

  //Place a bet
  const placeBet = async (e: FormEvent) => {
    e.preventDefault();
    if (marketState !== "OPEN") {
      console.log("marketState !== OPEN");
      return;
    }

    let amountToBetMultiplied = amountToBet * 1000000000000000000;

    let balance = await daiContract!.balanceOf(account);

    if (balance < amountToBetMultiplied) {
      toast({
        title: "Insufficient Funds",
        description: "Add more Dai to wallet",
        status: "warning",
        position: "bottom",
        duration: 9000,
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
        duration: 9000,
        isClosable: true,
      });

      let result = await tx.wait();
      toast({
        title: "Transaction Success",
        description: `${shortenAddress(result.transactionHash)}`,
        status: "success",
        position: "bottom",
        duration: 9000,
        isClosable: true,
      });
      setRerender(!forceRerender);
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction Failed",
        description: "Try increasing gas",
        status: "error",
        position: "bottom",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  //Withdraw functionality once the smart contract code is available
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
        backgroundColor="gray.100"
        borderRadius="0.5rem"
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
        margin="0 1.5rem"
      >
        <Flex
          borderBottom="1px solid black.100"
          alignItems="center"
          justifyContent="space-between"
          padding="0.5rem 1rem"
        >
          <span>{shortenAddress(marketContract.address)}</span>
          <Flex flexDirection="column" justifyContent="space-between">
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
            <span>
              {marketResolutionTime ? (
                <CountDown date={Date.now() + marketResolutionTime} />
              ) : (
                "-"
              )}
            </span>
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
          <Box width="75%">
            <Chart marketContract={marketContract} />
          </Box>
          {active && (
            <Form onSubmit={placeBet}>
              <Select
                width="50%"
                height="3rem"
                margin="0"
                color="#777"
                borderColor="gray.100"
                value={choice}
                onChange={(e: any) => setChoice(e.target.value)}
              >
                <Option disabled value="" />
                {outcomes.map((outcome: any) => (
                  <Option key={outcome} value={outcome}>
                    {outcome}
                  </Option>
                ))}
              </Select>
              <Button
                cursor="pointer"
                color="#777"
                marginTop="10px"
                type="button"
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
                    color="black.100"
                  >
                    {daiBalance ? daiBalance : "-"}
                  </Flex>
                ) : (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    color="black.100"
                  >
                    {etherBalance ? etherBalance : "-"}
                  </Flex>
                )}

                <Input
                  borderStyle="none"
                  backgroundColor="gray.100"
                  color="black.100"
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
                    border="2px solid red.100"
                    color="white.100"
                    backgroundColor="red.100"
                    type="submit"
                    isDisabled={amountToBet <= 0}
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
                      borderColor="red.100"
                      borderRadius="0.5rem"
                      color="red.100"
                      backgroundColor="white.100"
                      type="button"
                      onClick={() => withdraw()}
                    >
                      Withdraw
                    </Button>
                  )}
                </>
              )}
            </Form>
          )}
        </Flex>
        {checkOwner() && (
          <Flex justifyContent="center" flexDirection="column" mt="1rem">
            <Button
              my="0.25rem"
              backgroundColor="black.100"
              color="white.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "red.100" }}
              onClick={async () => await marketContract.incrementState()}
            >
              Increment Market State
            </Button>
            <Button
              my="0.25rem"
              backgroundColor="black.100"
              color="white.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "red.100" }}
              onClick={async () => await marketContract.determineWinner()}
            >
              Get Winner from Oracle
            </Button>
            <Button
              my="0.25rem"
              backgroundColor="black.100"
              color="white.100"
              textAlign="center"
              text-decoration="none"
              font-size="1rem"
              _hover={{ bg: "red.100" }}
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
