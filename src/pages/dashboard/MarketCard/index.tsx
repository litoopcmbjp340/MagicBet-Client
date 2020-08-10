import React, { useState, useEffect, FormEvent } from 'react';
import CountUp from 'react-countup';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { FiInfo, FiSettings } from 'react-icons/fi';

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
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/core';

import MBMarketContract from '../../../abis/MBMarket.json';
import useContract from '../../../hooks/useContract';
import ChartWrapper from './ChartWrapper';
import Info from '../../../components/Modals/Info';
import SettingsModal from '../../../components/Modals/Settings';
import { shortenAddress } from '../../../utils';
import { bgColor8, color2, color3 } from '../../../utils/theme';
import { injected } from '../../../utils/connectors';

import IERC20 from 'abis/IERC20.json';
import addresses, { KOVAN_ID } from 'utils/addresses';

const CountDown = ({ startDate }: { startDate: number }): any => {
  const realStartDate = moment(startDate).format('YYYY-MM-DD');

  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let isStale = false;
    if (!isStale) setInterval(() => getTimeUntil(realStartDate), 1000);

    return () => {
      isStale = true;
    };
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

  return time <= 0 ? (
    '-'
  ) : (
    <>{`${add0(days)}:${add0(hours)}:${add0(minutes)}:${add0(seconds)}`}</>
  );
};

const MarketCard = ({ marketContractAddress }: any) => {
  const marketContract = useContract(
    marketContractAddress,
    MBMarketContract.abi,
    true
  );
  const daiContract = useContract(
    addresses[KOVAN_ID].tokens.DAI,
    IERC20.abi,
    true
  );

  const { connector, account, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const infoModalToggle = useDisclosure();
  const settingsModalToggle = useDisclosure();

  const [amountToBet, setAmountToBet] = useState<number>(0);
  const [accruedInterest, setAccruedInterest] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>();
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
      let isStale = false;
      if (!!marketContract) {
        let time = await marketContract.marketResolutionTime();
        setMarketResolutionTime(time.toNumber() * 1000);

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
      }
      return () => {
        isStale = true;
      };
    })();
  }, [marketContract]);

  useEffect(() => {
    (async () => {
      let isStale = false;
      if (!!marketContract) {
        if (!isStale && marketContract.provider) {
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
      if (account && library && daiContract && !isStale && !!marketContract) {
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
  }, [account, daiContract, library]);

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

    const estimatedWei = await marketContract!.getEstimatedETHforDAI(formatted);
    const estimatedWeiWithMargin = increaseByFactor(estimatedWei[0]);

    const estimatedGas = await marketContract!.estimateGas.placeBet(
      indexOfChoice,
      formatted,
      { value: estimatedWeiWithMargin }
    );

    try {
      const tx = await marketContract!.placeBet(indexOfChoice, formatted, {
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
      const tx = await marketContract!.withdraw();
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
          align="center"
          justify="space-between"
          p="0.5rem 1rem"
          mb="1rem"
          wrap="wrap"
        >
          <Stat>
            <StatLabel color={color3[colorMode]}>Address</StatLabel>
            <StatNumber fontFamily="monospace">
              {shortenAddress(marketContract!.address)}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel color={color3[colorMode]}>Winnings</StatLabel>
            <StatNumber fontFamily="monospace">
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

          <Stat>
            <StatLabel color={color3[colorMode]}>Resolution</StatLabel>
            <StatNumber fontFamily="monospace">
              {marketResolutionTime && (
                <CountDown startDate={marketResolutionTime} />
              )}
            </StatNumber>
          </Stat>

          <Box display={{ xs: 'none', md: 'block' }}>
            <IconButton
              aria-label="market info"
              variant="ghost"
              color={color3[colorMode]}
              icon={<FiInfo />}
              size="md"
              onClick={infoModalToggle.onOpen}
            />
            <IconButton
              aria-label="purchase settings"
              variant="ghost"
              color={color3[colorMode]}
              icon={<FiSettings />}
              size="md"
              onClick={settingsModalToggle.onOpen}
            />
          </Box>
        </Flex>

        <Heading as="h1" textAlign="center" fontSize="3rem">
          {prompt}
        </Heading>
        <Box display={{ sm: 'block', md: 'none' }}>
          <Flex align="center" justify="center" mt="1rem">
            <IconButton
              aria-label="market info"
              variant="ghost"
              color={color3[colorMode]}
              icon={<FiInfo />}
              size="md"
              onClick={infoModalToggle.onOpen}
            />
            <IconButton
              aria-label="purchase settings"
              variant="ghost"
              color={color3[colorMode]}
              icon={<FiSettings />}
              size="md"
              onClick={settingsModalToggle.onOpen}
            />
          </Flex>
        </Box>

        <Flex justify="center" align="center" wrap="wrap">
          <Box display={{ xs: 'none', md: 'block' }}>
            <ChartWrapper marketContract={marketContract!} />
          </Box>

          {connector === injected && (
            <form onSubmit={placeBet}>
              <Flex direction="column" justify="center" align="center">
                <Select
                  w="auto"
                  h="3rem"
                  mt="1rem"
                  borderColor="secondary.100"
                  aria-label="Select an option"
                  value={choice}
                  onChange={(e: any) => setChoice(e.target.value)}
                >
                  <option disabled value="" />
                  {outcomes.map((outcome: any) => (
                    <option key={outcome} value={outcome} aria-label={outcome}>
                      {outcome}
                    </option>
                  ))}
                </Select>

                <Flex justify="center">
                  <Input
                    borderStyle="none"
                    color={color2[colorMode]}
                    bg={bgColor8[colorMode]}
                    fontSize="70px"
                    my="1"
                    py="3rem"
                    textAlign="center"
                    w="100%"
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    aria-label="Bet Input"
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
                    {state === 3 ? (
                      <Button
                        textTransform="uppercase"
                        color="primary.100"
                        w="8rem"
                        bg="light.100"
                        box-shadow="0 0.5rem 1rem rgba(0, 0, 0, 0.1)"
                        transition="all 0.3s ease 0s"
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
      <Info
        infoModalToggle={infoModalToggle}
        marketContract={marketContract!}
      />
      <SettingsModal
        settingsModalToggle={settingsModalToggle}
        marketContract={marketContract}
      />
    </>
  );
};

export default MarketCard;
