import React, { useState, FormEvent, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Icon,
  FormLabel,
  FormControl,
  Input,
  Flex,
  Spinner,
  useColorMode,
  Select,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
} from '@chakra-ui/core';
import { isAddress } from '@ethersproject/address';
import moment from 'moment';

import { useContract } from '../../../hooks';
import MBMarketFactoryContract from '../../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../../utils/addresses';
import { bgColor7, bgColor6 } from '../../../utils/theme';

const CreateMarket = ({ createMarketModalToggle }: any): JSX.Element => {
  const { colorMode } = useColorMode();

  const factoryContract = useContract(
    addresses[KOVAN_ID].marketFactory,
    MBMarketFactoryContract.abi,
    true
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [marketEventName, setMarketEventName] = useState<string>(
    'Who will win the 2020 US General Election?'
  );

  const [realitioQuestion, setRealitioQuestion] = useState<string>(
    'Who will win the 2020 US General Election␟"Donald Trump","Joe Biden"␟news-politics␟en_US'
  );
  const [arbitrator, setArbitrator] = useState<string>(
    '0xd47f72a2d1d0E91b0Ec5e5f5d02B2dc26d00A14D'
  );

  const [marketOpeningTime, setMarketOpeningTime] = useState<number>(
    Date.now() / 1000
  );
  const [marketLockingTime, setMarketLockingTime] = useState<number>(
    Date.now() / 1000
  );
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(
    Date.now() / 1000
  );
  const [timeout, setTimeout] = useState<number>(10);
  const [outcomes, setOutcomes] = useState<string>('');
  const [category, setCategory] = useState<string>('misc');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const MARKET_EVENT_NAME = marketEventName;

    // const OUTCOMES = outcomes.map((outcome) => `"${outcome}"`).join(',');

    if (!isAddress(arbitrator)) {
      console.log(`${arbitrator} is not a valid address`);
      return;
    }
    console.log('options:', options);

    const MARKET_OPENING_TIME = Math.round(marketOpeningTime).toString();
    const MARKET_LOCKING_TIME = Math.round(marketLockingTime).toString();
    const MARKET_RESOLUTION_TIME = Math.round(marketResolutionTime).toString();

    // if (
    //   marketOpeningTime >= marketLockingTime ||
    //   marketLockingTime >= marketResolutionTime
    // ) {
    //   console.log('Times not in correct order');
    //   return;
    // }

    const TIMEOUT = timeout * 1200; //convert hours to seconds

    // const REALITIO_QUESTION = `${MARKET_EVENT_NAME}␟${inputs}␟${category}␟en_US`;
    // console.log('REALITIO_QUESTION:', REALITIO_QUESTION);

    // try {
    //   setLoading(true);
    //   const tx = await factoryContract!.createMarket(
    //     MARKET_EVENT_NAME,
    //     MARKET_OPENING_TIME,
    //     MARKET_LOCKING_TIME,
    //     MARKET_RESOLUTION_TIME,
    //     TIMEOUT,
    //     arbitrator,
    //     REALITIO_QUESTION,
    //     inputs
    //   );
    //   await tx.wait();
    // } catch (error) {
    //   console.error(error);
    // }

    // setLoading(false);

    // createMarketModalToggle.onClose();
  };

  const [options, setOptions] = useState<any>([{ name: '' }]);
  const [option, setOption] = useState<string>('');

  const addOption = () => setOptions(options.concat([{ name: '' }]));

  const removeOption = (index: any) => () =>
    setOptions(options.filter((s: any, sidx: any) => index !== sidx));
  return (
    <Modal
      isOpen={createMarketModalToggle.isOpen}
      onClose={createMarketModalToggle.onClose}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />

      <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
        {loading ? (
          <Flex justifyContent="center" m="1rem 0">
            <Spinner color="primary.100" size="xl" thickness="0.25rem" />
          </Flex>
        ) : (
          <>
            <ModalHeader>Create a Market</ModalHeader>
            <ModalCloseButton onClick={createMarketModalToggle.onClose} />
            <ModalBody>
              <form onSubmit={onSubmit}>
                <FormControl marginBottom="1rem" isRequired>
                  <FormLabel color="#777" htmlFor="marketEventName">
                    Event Name
                  </FormLabel>
                  <Input
                    borderColor="secondary.100"
                    name="marketEventName"
                    type="text"
                    placeholder={marketEventName}
                    value={marketEventName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMarketEventName(e.target.value)
                    }
                  />
                </FormControl>

                <FormControl marginBottom="1rem" isRequired>
                  <FormLabel color="#777" htmlFor="tokens">
                    Outcomes
                  </FormLabel>

                  {options.map((option: any, i: any) => (
                    <Flex w="100%" mb="1rem" key={i}>
                      <Input
                        borderColor="secondary.100"
                        type="text"
                        name="tokens"
                        placeholder="Trump"
                        value={option}
                        onChange={(e: any) => setOutcomes(e.target.value)}
                      />
                      <IconButton
                        aria-label="add"
                        icon="close"
                        type="button"
                        size="sm"
                        onClick={removeOption(i)}
                      />
                    </Flex>
                  ))}
                  <IconButton
                    aria-label="remove"
                    type="button"
                    size="sm"
                    icon="add"
                    onClick={addOption}
                  />
                </FormControl>

                <Flex width="100%" marginBottom="1rem">
                  <FormControl marginRight="0.5rem" isRequired>
                    <FormLabel color="#777" htmlFor="marketOpeningTime">
                      Opening
                    </FormLabel>
                    <DatePicker
                      id="marketOpeningTime"
                      minDate={moment().toDate()}
                      selected={new Date(marketOpeningTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketOpeningTime(date.getTime() / 1000)
                      }
                      dateFormat="MMMM d, yyyy h:mm aa"
                      showTimeSelect
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketOpeningTime}
                        />
                      }
                    />
                  </FormControl>
                  <FormControl marginRight="0.5rem" isRequired>
                    <FormLabel color="#777" htmlFor="marketLockingTime">
                      Locking
                    </FormLabel>
                    <DatePicker
                      id="marketLockingTime"
                      minDate={moment().toDate()}
                      selected={new Date(marketLockingTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketLockingTime(date.getTime() / 1000)
                      }
                      dateFormat="MMMM d, yyyy h:mm aa"
                      showTimeSelect
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketLockingTime}
                        />
                      }
                    />
                  </FormControl>
                </Flex>
                <Flex width="100%" marginBottom="1rem">
                  <FormControl marginRight="0.5rem" isRequired>
                    <FormLabel color="#777" htmlFor="marketResolutionTime">
                      Resolution
                    </FormLabel>
                    <DatePicker
                      id="marketResolutionTime"
                      minDate={moment().toDate()}
                      selected={new Date(marketResolutionTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketResolutionTime(date.getTime() / 1000)
                      }
                      dateFormat="MMMM d, yyyy h:mm aa"
                      showTimeSelect
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketResolutionTime}
                        />
                      }
                    />
                  </FormControl>
                  <FormControl marginRight="0.5rem" isRequired>
                    <FormLabel color="#777" htmlFor="timeout">
                      Timeout
                    </FormLabel>
                    <Tooltip
                      label="Hours before market can finalize"
                      placement="top"
                      aria-label="info"
                      zIndex={1800}
                    >
                      <Icon name="info" color="#777" />
                    </Tooltip>
                    <NumberInput
                      marginRight="0.5rem"
                      defaultValue={15}
                      min={1}
                      value={timeout}
                      //@ts-ignore
                      onChange={(e) => setTimeout(e)}
                    >
                      <NumberInputField type="number" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Flex>
                <FormControl mb="1rem">
                  <FormLabel htmlFor="category" color="#777">
                    Category
                  </FormLabel>
                  <Select id="category" placeholder="Category">
                    <option value="arts">Arts</option>
                    <option value="business-finance">Business & Finance</option>
                    <option value="crypto">Crypto</option>
                    <option value="news-politics">News & Politics</option>
                    <option value="science-tech">Science & Tech</option>
                    <option value="sports">Sports</option>
                    <option value="weather">Weather</option>
                    <option value="misc">Miscellaneous</option>
                  </Select>
                </FormControl>
                <FormControl marginBottom="1rem">
                  <FormLabel color="#777" htmlFor="arbitrator">
                    Arbitrator
                  </FormLabel>
                  <Tooltip
                    label="Arbitrator Contract. Defaults to Kleros."
                    placement="right"
                    aria-label="info"
                    zIndex={1800}
                  >
                    <Icon name="info" color="#777" />
                  </Tooltip>
                  <Input
                    borderColor="secondary.100"
                    name="arbitrator"
                    type="text"
                    isRequired
                    value={arbitrator}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setArbitrator(e.target.value)
                    }
                  />
                </FormControl>
                <Button
                  borderRadius="0.33rem"
                  color="light.100"
                  textAlign="center"
                  padding="0.8rem"
                  marginBottom="1rem"
                  width="100%"
                  cursor="pointer"
                  backgroundColor={bgColor6[colorMode]}
                  _hover={{ bg: 'primary.100' }}
                  type="submit"
                >
                  Create Market
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateMarket;
