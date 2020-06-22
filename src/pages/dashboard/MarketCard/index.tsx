import React, { useState, useEffect, FormEvent } from 'react';
import CountUp from 'react-countup';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import moment from 'moment';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Button,
  Select,
  useToast,
  useDisclosure,
  useColorMode,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/core';

import Chart from './Chart';
import { injected } from '../../../utils/connectors';
import Info from '../../../components/Modals/Info';
import SettingsModal from 'components/Modals/Settings';
import { shortenAddress } from '../../../utils';
// import { useEthBalance, useTokenBalance } from '../../../hooks';
import { useDaiContract } from '../../../hooks/useHelperContract';
// import { useTokens } from '../../../utils/tokens';
import { bgColor8, color2 } from '../../../utils/theme';

const CountDown = ({ startDate }: any) => {
  const realStartDate = moment(startDate).format('YYYY-MM-DD');

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setInterval(() => getTimeUntil(realStartDate), 1000);
  }, [realStartDate]);

  function getTimeUntil(realStartDate: any) {
    const time =
      Date.parse(realStartDate) -
      Date.parse(new Date() + '') -
      7 * 60 * 60 * 1000;
    setTime(time);
    setSeconds(Math.floor((time / 1000) % 60));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setDays(Math.floor((time / (1000 * 60 * 60 * 24)) % 30));
  }

  function add0(number: any) {
    return number < 10 ? '0' + number : number;
  }
  return time === 0 ? null : (
    <>{`${add0(days)}:${add0(hours)}:${add0(minutes)}:${add0(seconds)}`}</>
  );
};

const MarketCard = ({ marketContract }: any) => {
  console.log('marketContract:', marketContract);
  const { connector, account, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const infoModalToggle = useDisclosure();
  const settingsModalToggle = useDisclosure();
  const daiContract = useDaiContract();

  const toast = useToast();

  const [amountToBet, setAmountToBet] = useState<number>(0);
  const [accruedInterest, setAccruedInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<any>();
  const [prompt, setPrompt] = useState<string>('');
  const [choice, setChoice] = useState<string>('');
  const [outcomes, setOutcomes] = useState<any>([]);
  const [state, setState] = useState<number>();
  // const [daiApproved, setDaiApproved] = useState<boolean>(false);
  // const [usingDai, setUsingDai] = useState<boolean>(true);

  // const { data } = useEthBalance(account!, false);
  // const tokens = useTokens();
  // const daiToken = tokens[0][5];
  // const { data: tokenData } = useTokenBalance(daiToken, account!, false);

  // marketContract.on('ParticipantEntered', (address: any) =>
  //   console.log('Address: ', address)
  // );

  // let wallet: any;
  // if (!!library && !!account) wallet = library.getSigner(account);

  useEffect(() => {
    (async () => {
      let time = await marketContract.marketResolutionTime();
      time = time.toNumber();
      setMarketResolutionTime(time * 1000);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (!isStale) {
        if (marketContract.provider) {
          const state = await marketContract.getCurrentState();
          setState(state);
          setPrompt(await marketContract.eventName());
          const totalInterest = await marketContract.getTotalInterest();
          setAccruedInterest(parseFloat(formatEther(totalInterest)));
        }
      }
      return () => {
        isStale = true;
      };
    })();
  }, [marketContract]);

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
            // console.log('allowance:', allowance);
            // if (allowance.toString() !== '0') setDaiApproved(true);
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

    const estimatedGas = await marketContract.estimateGas.placeBet(
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

  return !prompt ? null : (
    <>
      <Box
        bg={bgColor8[colorMode]}
        borderRadius="0.5rem"
        m="0 1.5rem"
        px="0.5rem"
        pb="1.5rem"
      >
        <Flex
          borderBottom="1px solid dark.100"
          alignItems="center"
          justifyContent="space-between"
          p="0.5rem 1rem"
          mb="1rem"
          flexWrap="wrap"
        >
          <Stat textAlign="center">
            <StatLabel color="#555">Address</StatLabel>
            <StatNumber>{shortenAddress(marketContract.address)}</StatNumber>
          </Stat>

          <Stat textAlign="center">
            <StatLabel color="#555">Winnings</StatLabel>
            <StatNumber>
              {
                <CountUp
                  start={0}
                  end={accruedInterest}
                  decimals={7}
                  preserveValue={true}
                  duration={10}
                />
              }
            </StatNumber>
          </Stat>

          <Stat textAlign="center">
            <StatLabel color="#555">Resolution</StatLabel>
            <StatNumber>
              {marketResolutionTime ? (
                <CountDown startDate={marketResolutionTime} />
              ) : (
                '00:00:00:00'
              )}
            </StatNumber>
          </Stat>
          <Box>
            <IconButton
              aria-label="market info"
              variant="ghost"
              color="#555"
              icon="info"
              size="md"
              pr={0.5}
              onClick={infoModalToggle.onOpen}
            />
            <IconButton
              aria-label="purchase settings"
              variant="ghost"
              color="#555"
              icon="settings"
              size="md"
              onClick={settingsModalToggle.onOpen}
            />
          </Box>
        </Flex>
        <Heading as="h1" textAlign="center" fontSize="3rem">
          {prompt}
        </Heading>

        <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
          <Box display={{ sm: 'none', md: 'block' }}>
            <Chart marketContract={marketContract} />
          </Box>

          {connector === injected && (
            <form onSubmit={placeBet}>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
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
                  <>
                    {state !== 3 ? (
                      <Button
                        textTransform="uppercase"
                        color="primary.100"
                        w="8rem"
                        bg="light.100"
                        box-shadow="0 0.5rem 1rem rgba(0, 0, 0, 0.1)"
                        transition="all 0.3s ease 0s"
                        outline="none"
                        cursor="pointer"
                        type="button"
                        _hover={{
                          boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-5px)',
                          border: '1px',
                          borderColor: 'primary.100',
                        }}
                        onClick={() => withdraw()}
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Button
                        textTransform="uppercase"
                        fontSize="1.33rem"
                        color="light.100"
                        w="8rem"
                        bg="primary.100"
                        border="none"
                        box-shadow="0 0.5rem 1rem rgba(0, 0, 0, 0.1)"
                        transition="all 0.3s ease 0s"
                        outline="none"
                        cursor="pointer"
                        type="submit"
                        isDisabled={amountToBet <= 0 || choice === ''}
                        _hover={{
                          boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-5px)',
                        }}
                      >
                        Enter
                      </Button>
                    )}
                  </>
                )}
              </Flex>
            </form>
          )}
        </Flex>
      </Box>
      <Info infoModalToggle={infoModalToggle} marketContract={marketContract} />
      <SettingsModal
        settingsModalToggle={settingsModalToggle}
        marketContract={marketContract}
      />
    </>
  );
};

export default MarketCard;
