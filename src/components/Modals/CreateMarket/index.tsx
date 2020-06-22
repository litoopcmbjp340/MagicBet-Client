import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Flex,
  Spinner,
  useColorMode,
} from '@chakra-ui/core';

import { useContract } from 'hooks';
import MBMarketFactoryContract from 'abis/MBMarketFactory.json';
import addresses, { KOVAN_ID } from 'utils/addresses';
import { bgColor7, bgColor6 } from 'utils/theme';

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
  const [outcomes, setOutcomes] = useState<string[]>(['Trump', 'Biden']);

  const { handleSubmit, errors, register, formState } = useForm();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const MARKET_EVENT_NAME = marketEventName;
    const MARKET_OPENING_TIME = Math.round(marketOpeningTime).toString();
    const MARKET_LOCKING_TIME = Math.round(marketLockingTime).toString();
    const MARKET_RESOLUTION_TIME = Math.round(marketResolutionTime).toString();
    const TIMEOUT = timeout;
    const ARBITRATOR = arbitrator;
    const REALITIO_QUESTION = realitioQuestion;
    const OUTCOMES = outcomes;

    try {
      setLoading(true);
      // console.log(
      //   MARKET_EVENT_NAME,
      //   MARKET_OPENING_TIME,
      //   MARKET_LOCKING_TIME,
      //   MARKET_RESOLUTION_TIME,
      //   TIMEOUT,
      //   ARBITRATOR,
      //   REALITIO_QUESTION,
      //   OUTCOMES
      // );
      const tx = await factoryContract!.createMarket(
        MARKET_EVENT_NAME,
        MARKET_OPENING_TIME,
        MARKET_LOCKING_TIME,
        MARKET_RESOLUTION_TIME,
        TIMEOUT,
        ARBITRATOR,
        REALITIO_QUESTION,
        OUTCOMES
      );
      await tx.wait();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);

    createMarketModalToggle.onClose();
  };

  function validateMarketEventName(value: any) {
    let error;
    if (!value) error = 'Market Event Name is required';
    return error || true;
  }

  //@ts-ignore
  const CustomInput = ({ value, label, onClick, id }) => (
    <Input
      borderColor="secondary.100"
      id={id}
      placeholder={label}
      isReadOnly
      value={value}
      onFocus={onClick}
    />
  );

  return (
    <Modal
      isOpen={createMarketModalToggle.isOpen}
      onClose={createMarketModalToggle.onClose}
      isCentered
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
                <FormControl marginBottom="1rem" isInvalid={errors.name}>
                  <FormLabel color="#777" htmlFor="marketEventName">
                    Event Name
                  </FormLabel>
                  <Input
                    borderColor="secondary.100"
                    name="marketEventName"
                    type="text"
                    isRequired
                    placeholder={marketEventName}
                    value={marketEventName}
                    ref={register({ validate: validateMarketEventName })}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMarketEventName(e.target.value)
                    }
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl marginBottom="1rem">
                  <FormLabel color="#777" htmlFor="realitioQuestion">
                    Realit.io Question
                  </FormLabel>
                  <Input
                    borderColor="secondary.100"
                    name="realitioQuestion"
                    type="text"
                    isRequired
                    value={realitioQuestion}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setRealitioQuestion(e.target.value)
                    }
                  />
                </FormControl>
                <FormControl marginBottom="1rem">
                  <FormLabel color="#777" htmlFor="arbitrator">
                    Arbitrator
                  </FormLabel>
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
                <Flex width="100%" marginBottom="1rem">
                  <FormControl marginRight="0.5rem">
                    <FormLabel color="#777" htmlFor="marketOpeningTime">
                      Opening
                    </FormLabel>
                    <DatePicker
                      selected={new Date(marketOpeningTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketOpeningTime(date.getTime() / 1000)
                      }
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketOpeningTime}
                        />
                      }
                      id="marketOpeningTime"
                    />
                  </FormControl>
                  <FormControl marginRight="0.5rem">
                    <FormLabel color="#777" htmlFor="marketLockingTime">
                      Locking
                    </FormLabel>
                    <DatePicker
                      selected={new Date(marketLockingTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketLockingTime(date.getTime() / 1000)
                      }
                      id="marketLockingTime"
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketLockingTime}
                        />
                      }
                    />
                  </FormControl>
                  <FormControl marginRight="0.5rem">
                    <FormLabel color="#777" htmlFor="marketResolutionTime">
                      Resolution
                    </FormLabel>
                    <DatePicker
                      selected={new Date(marketResolutionTime * 1000)}
                      onChange={(date: Date) =>
                        setMarketResolutionTime(date.getTime() / 1000)
                      }
                      id="marketResolutionTime"
                      customInput={
                        <Input
                          borderColor="secondary.100"
                          value={marketResolutionTime}
                        />
                      }
                    />
                  </FormControl>
                </Flex>
                <Flex width="100%" marginBottom="1rem">
                  <FormControl width="25%" marginRight="0.5rem">
                    <FormLabel color="#777" htmlFor="timeout">
                      Timeout
                    </FormLabel>
                    <Input
                      borderColor="secondary.100"
                      name="timeout"
                      type="number"
                      isRequired
                      value={timeout}
                      onChange={(e: any) => setTimeout(e.target.value)}
                    />
                  </FormControl>
                  <FormControl width="75%">
                    <FormLabel color="#777" htmlFor="tokens">
                      Outcomes
                    </FormLabel>
                    <Input
                      borderColor="secondary.100"
                      type="text"
                      name="tokens"
                      isRequired
                      placeholder="Token"
                      value={outcomes}
                      onChange={(e: any) => setOutcomes(e.target.value)}
                    />
                  </FormControl>
                </Flex>
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
                  isLoading={formState.isSubmitting}
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
