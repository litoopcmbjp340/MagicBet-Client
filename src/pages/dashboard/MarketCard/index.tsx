import React, { useState, useEffect, FormEvent } from 'react';
import CountUp from 'react-countup';
import CountDown from 'react-countdown';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Button,
  Text,
  Select,
  useToast,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/core';
import dynamic from 'next/dynamic';

import Info from '../../../components/Modals/Info';
import SettingsModal from 'components/Modals/Settings';
import OwnerFunctionality from './OwnerFunctionality';
import { shortenAddress } from '../../../utils';
import { useEthBalance, useTokenBalance } from '../../../hooks';
import { useTokens } from '../../../utils/tokens';
import { bgColor8, color2 } from '../../../utils/theme';

const MarketCard = ({ marketContract, daiContract }: any) => {
  const { active, account, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const infoModalToggle = useDisclosure();
  const settingsModalToggle = useDisclosure();

  const toast = useToast();
  const Chart = dynamic(() => import('./Chart'));

  const [amountToBet, setAmountToBet] = useState<number>(0);
  const [accruedInterest, setAccruedInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(0);
  const MarketStates = ['SETUP', 'WAITING', 'OPEN', 'LOCKED', 'WITHDRAW'];
  const [marketState, setMarketState] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [choice, setChoice] = useState<string>('');
  const [outcomes, setOutcomes] = useState<any>([]);
  const [daiApproved, setDaiApproved] = useState<boolean>(false);
  const [usingDai, setUsingDai] = useState<boolean>(true);

  const { data } = useEthBalance(account!, false);
  const tokens = useTokens();
  const daiToken = tokens[0][5];
  const { data: tokenData } = useTokenBalance(daiToken, account!, false);

  marketContract.on('StateChanged', (state: any) =>
    console.log('State: ', state)
  );
  marketContract.on('ParticipantEntered', (address: any) =>
    console.log('Address: ', address)
  );

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (marketContract && !isStale) {
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
        const accIntFormatted = formatEther(_accruedInterest);
        const val = parseFloat(accIntFormatted);
        setAccruedInterest(val);
      }
      return () => {
        isStale = true;
      };
    })();
  }, [MarketStates, account, marketContract]);

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (account && library && daiContract && !isStale) {
        const getAllowance = async () => {
          return await daiContract.allowance(account, marketContract.address);
        };
        // const { data: _allowance } = useTokenAllowance(daiToken, account, marketContract.address)
        if (account) {
          getAllowance().then((allowance) => {
            if (allowance.toString() !== '0') setDaiApproved(true);
          });
        }
      }
      return () => {
        isStale = true;
      };
    })();
  }, [account, daiContract, library, marketContract.address]);

  useEffect(() => {
    (async () => {
      let isStale = false;
      const numberOfOutcomes = await marketContract.numberOfOutcomes();
      if (numberOfOutcomes.toNumber() !== 0 && !isStale) {
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
      return () => {
        isStale = true;
      };
    })();
  }, [marketContract]);

  const placeBet = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const amountToBetMultiplied = amountToBet * 1000000000000000000;

    const balance = await daiContract!.balanceOf(account);

    if (balance < amountToBetMultiplied) {
      toast({
        title: 'Insufficient Funds',
        description: 'Add more Dai to wallet',
        status: 'warning',
        position: 'bottom',
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

    const formatted = parseUnits(amountToBet.toString(), 18);

    const increaseByFactor = (number: any) =>
      number.mul(BigNumber.from(120)).div(BigNumber.from(100));

    const estimatedWei = await marketContract.getEstimatedETHforDAI(formatted);
    const estimatedWeiWithMargin = increaseByFactor(estimatedWei[0]);
    // const estimatedGas = await marketContract.estimate.placeBet(
    //   indexOfChoice,
    //   formatted,
    //   { value: estimatedWeiWithMargin }
    // );

    try {
      const tx = await marketContract.placeBet(indexOfChoice, formatted, {
        // gasLimit: increaseByFactor(estimatedGas),
        value: estimatedWeiWithMargin,
      });

      toast({
        title: 'Transaction Confirmed',
        description: `${shortenAddress(tx.hash)}`,
        status: 'info',
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      });

      const result = await tx.wait();
      toast({
        title: 'Transaction Success',
        description: `${shortenAddress(result.transactionHash)}`,
        status: 'success',
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Transaction Failed',
        description: 'Try increasing gas',
        status: 'error',
        position: 'bottom',
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
      <Box bg={bgColor8[colorMode]} borderRadius="0.5rem" m="0 1.5rem">
        <Flex
          borderBottom="1px solid dark.100"
          alignItems="center"
          justifyContent="space-between"
          p="0.5rem 1rem"
        >
          <Flex flexDirection="column" justifyContent="space-between">
            <Text
              color="#555"
              font-size="12px"
              line-height="1.5"
              m="0 0 10px"
              p="0"
              textAlign="center"
            >
              Address
            </Text>
            <Text>{shortenAddress(marketContract.address)}</Text>
          </Flex>
          <Flex flexDirection="column" justifyContent="space-between" ml="2rem">
            <Text
              color="#555"
              font-size="12px"
              line-height="1.5"
              m="0 0 10px"
              p="0"
              textAlign="center"
            >
              Potential Winnings
            </Text>
            <Box textAlign="center">
              <CountUp
                start={0}
                end={accruedInterest}
                decimals={10}
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
            <Flex mt={0}>
              <IconButton
                aria-label="market info"
                variant="ghost"
                icon="info"
                size="md"
                pr={0.5}
                onClick={infoModalToggle.onOpen}
              />
              <IconButton
                aria-label="purchase settings"
                variant="ghost"
                icon="settings"
                size="md"
                onClick={settingsModalToggle.onOpen}
              />
            </Flex>
            <Text width="5.5rem" mt="-5px">
              {marketResolutionTime ? (
                <CountDown date={Date.now() + marketResolutionTime} />
              ) : (
                '-'
              )}
            </Text>
          </Flex>
        </Flex>
        <Heading as="h1" textAlign="center" fontSize="3rem">
          {prompt}
        </Heading>

        <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
          {/* <Box display={{ sm: 'none', md: 'block' }}>
            <Chart marketContract={marketContract} />
          </Box> */}

          {active && (
            <form onSubmit={placeBet}>
              <Flex flexDirection="column" justifyContent="center">
                <Select
                  w="auto"
                  h="3rem"
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
                    color={color2[colorMode]}
                    backgroundColor={bgColor8[colorMode]}
                    fontSize="70px"
                    my="1"
                    py="3rem"
                    textAlign="center"
                    w="50%"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    onChange={(e: any) => setAmountToBet(e.target.value)}
                    onKeyDown={(e: any) =>
                      (e.key === 'e' && e.preventDefault()) ||
                      (e.key === '+' && e.preventDefault()) ||
                      (e.key === '-' && e.preventDefault())
                    }
                  />
                </Flex>

                {!!(library && account) && (
                  <Flex justifyContent="center">
                    <Button
                      borderRadius="0.5rem"
                      cursor="pointer"
                      fontSize="1.33rem"
                      w="8rem"
                      border="2px solid primary.100"
                      color="light.100"
                      backgroundColor="primary.100"
                      type="submit"
                      _hover={{ bg: 'dark.100' }}
                      isDisabled={
                        amountToBet <= 0 ||
                        marketState !== 'OPEN' ||
                        choice === ''
                      }
                    >
                      Enter
                    </Button>
                    {marketState === 'WITHDRAW' && (
                      <Button
                        cursor="pointer"
                        fontSize="1.33rem"
                        mt="1rem"
                        w="8rem"
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
      <Info infoModalToggle={infoModalToggle} />
      <SettingsModal settingsModalToggle={settingsModalToggle} />
    </>
  );
};

export default MarketCard;
