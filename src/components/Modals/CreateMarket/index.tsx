import React, { useState, FormEvent, ChangeEvent, useContext } from 'react';
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
  IconButton,
} from '@chakra-ui/core';
import { isAddress } from '@ethersproject/address';
import moment from 'moment';

import { useContract } from '../../../hooks';
import MBMarketFactoryContract from '../../../abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from '../../../utils/addresses';
import { bgColor7, bgColor6 } from '../../../utils/theme';
import { ADD_MARKET_CONTRACT } from 'state/contracts/Constants';
import { ContractContext } from 'state/contracts/Context';

const CreateMarket = ({ createMarketModalToggle }: any): JSX.Element => {
  const { colorMode } = useColorMode();
  const values = useContext(ContractContext);
  const { contracts, dispatch } = useContext(ContractContext);

  const factoryContract = useContract(
    addresses[KOVAN_ID].marketFactory,
    MBMarketFactoryContract.abi,
    true
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [marketEventName, setMarketEventName] = useState<string>('');
  const [arbitrator, setArbitrator] = useState<string>(
    '0xd47f72a2d1d0E91b0Ec5e5f5d02B2dc26d00A14D'
  );

  const [marketOpeningTime, setMarketOpeningTime] = useState<number>(
    Date.now() / 1000
  );
  const [marketLockingTime, setMarketLockingTime] = useState<number>(
    Date.now() / 1000 + 86400
  );
  const [marketResolutionTime, setMarketResolutionTime] = useState<number>(
    Date.now() / 1000 + 172800
  );
  const [timeout, setTimeout] = useState<number>(10);
  const [options, setOptions] = useState<any>(['']);
  const [category, setCategory] = useState<string>('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const MARKET_EVENT_NAME = marketEventName;

    let CATEGORY = '';

    if (category === '') CATEGORY = 'misc';

    if (!isAddress(arbitrator)) {
      console.error(`${arbitrator} is not a valid address`);
      return;
    }

    const MARKET_OPENING_TIME = Math.round(marketOpeningTime).toString();
    const MARKET_LOCKING_TIME = Math.round(marketLockingTime).toString();
    const MARKET_RESOLUTION_TIME = Math.round(marketResolutionTime).toString();

    if (
      marketOpeningTime >= marketLockingTime ||
      marketLockingTime >= marketResolutionTime
    ) {
      console.error('Times are equal or are not in the correct order');
      return;
    }

    const TIMEOUT = timeout * 1200; //convert hours to seconds

    const REALITIO_QUESTION = `${MARKET_EVENT_NAME}␟${options}␟${CATEGORY}␟en_US`;

    try {
      setLoading(true);
      const tx = await factoryContract!.createMarket(
        MARKET_EVENT_NAME,
        MARKET_OPENING_TIME,
        MARKET_LOCKING_TIME,
        MARKET_RESOLUTION_TIME,
        TIMEOUT,
        arbitrator,
        REALITIO_QUESTION,
        options
      );
      await tx.wait();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);

    //Then, add contract to context
    // dispatch({ type: ADD_MARKET_CONTRACT, contract: contract });

    createMarketModalToggle.onClose();
  };

  const removeOption = (index: any) => () =>
    setOptions(options.filter((s: any, sidx: any) => index !== sidx));

  const handleOptionChange = (idx: any) => (evt: any) => {
    const newOptions = options.map((option: any, sidx: any) => {
      if (idx !== sidx) return option;
      return evt.target.value;
    });

    setOptions(newOptions);
  };

  return (
    <Modal
      isOpen={createMarketModalToggle.isOpen}
      onClose={createMarketModalToggle.onClose}
      isCentered
    >
      <ModalOverlay />

      <ModalContent bg={bgColor7[colorMode]} borderRadius="0.25rem">
        {loading ? (
          <Flex justify="center" m="1rem 0">
            <Spinner color="primary.100" size="xl" thickness="0.25rem" />
          </Flex>
        ) : (
          <>
            <ModalHeader>Create a Market</ModalHeader>
            <ModalCloseButton onClick={createMarketModalToggle.onClose} />
            <ModalBody>
              <form onSubmit={onSubmit}>
                <FormControl mb="1rem" isRequired>
                  <FormLabel htmlFor="marketEventName">Event Name</FormLabel>
                  <Input
                    name="marketEventName"
                    type="text"
                    placeholder={marketEventName}
                    value={marketEventName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMarketEventName(e.target.value)
                    }
                  />
                </FormControl>

                <Flex justify="center" align="center">
                  <FormControl mb="1rem" w="100%" isRequired>
                    <FormLabel htmlFor="tokens">Outcomes</FormLabel>

                    {options.map((option: any, i: any) => (
                      <Flex
                        w="100%"
                        mb="1rem"
                        justify="center"
                        align="center"
                        key={i}
                      >
                        <Input
                          type="text"
                          name="tokens"
                          value={option}
                          onChange={handleOptionChange(i)}
                        />
                        <IconButton
                          aria-label="remove"
                          icon="small-close"
                          type="button"
                          size="sm"
                          ml="0.5rem"
                          onClick={removeOption(i)}
                          isDisabled={options.length === 1}
                        />
                        {options.length - 1 === i && (
                          <IconButton
                            aria-label="add"
                            type="button"
                            size="sm"
                            ml="0.5rem"
                            icon="small-add"
                            onClick={() => setOptions(options.concat(['']))}
                          />
                        )}
                      </Flex>
                    ))}
                  </FormControl>
                </Flex>

                <Flex w="100%" mb="1rem">
                  <FormControl mr="0.5rem" isRequired>
                    <FormLabel htmlFor="marketOpeningTime">Opening</FormLabel>
                    <DatePicker
                      id="marketOpeningTime"
                      minDate={moment().toDate()}
                      selected={new Date(marketOpeningTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketOpeningTime(date.getTime() / 1000)
                      }
                      dateFormat="MMMM d, yyyy h:mm aa"
                      showTimeSelect
                      customInput={<Input value={marketOpeningTime} />}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="marketLockingTime">Locking</FormLabel>
                    <DatePicker
                      id="marketLockingTime"
                      minDate={moment().toDate()}
                      selected={new Date(marketLockingTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketLockingTime(date.getTime() / 1000)
                      }
                      dateFormat="MMMM d, yyyy h:mm aa"
                      showTimeSelect
                      customInput={<Input value={marketLockingTime} />}
                    />
                  </FormControl>
                </Flex>
                <Flex w="100%" mb="1rem">
                  <FormControl mr="0.5rem" w="50%" isRequired>
                    <FormLabel htmlFor="marketResolutionTime">
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
                      customInput={<Input value={marketResolutionTime} />}
                    />
                  </FormControl>
                  <FormControl w="50%" isRequired>
                    <FormLabel htmlFor="timeout">Timeout</FormLabel>
                    <Tooltip
                      label="Hours before market can finalize"
                      placement="top"
                      aria-label="info"
                      zIndex={1800}
                    >
                      <Icon name="info" />
                    </Tooltip>
                    <NumberInput
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
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select
                    id="category"
                    placeholder="Category"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                  >
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
                <FormControl mb="1rem">
                  <FormLabel htmlFor="arbitrator">Arbitrator</FormLabel>
                  <Tooltip
                    label="Arbitrator Contract. Defaults to Kleros."
                    placement="right"
                    aria-label="info"
                    zIndex={1800}
                  >
                    <Icon name="info" />
                  </Tooltip>
                  <Input
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
                  color="light.100"
                  textAlign="center"
                  mb="1rem"
                  w="100%"
                  bg={bgColor6[colorMode]}
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
