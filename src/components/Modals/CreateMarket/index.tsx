import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";

import { ContractContext } from "state/contracts/Context";

import { Spinner } from "@chakra-ui/core";
import { useContract } from "utils/hooks";

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
} from "@chakra-ui/core";

import BTMarketFactoryContract from "abis/BTMarketFactory.json";

import addresses, { KOVAN_ID } from "utils/addresses";
const factoryAddress = addresses[KOVAN_ID].marketFactory;

interface ICreateMarketModal {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMarket = ({ isOpen, onClose }: ICreateMarketModal) => {
  const { contractState } = useContext(ContractContext);
  const factoryContract = useContract(
    factoryAddress,
    BTMarketFactoryContract.abi,
    true
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [marketEventName, setMarketEventName] = useState<string>(
    "Who will win the 2020 US General Election?"
  );
  const [marketOpeningTime, setMarketOpeningTime] = useState<number>(0);
  const [marketLockingTime, setMarketLockingTime] = useState<number>(0);
  const [marketResolutionTime, setMarketResolutionTime] = useState<any>(0);
  const [timeout, setTimeout] = useState<number>(40);
  const [arbitrator, setArbitrator] = useState<string>(
    "0xd47f72a2d1d0E91b0Ec5e5f5d02B2dc26d00A14D"
  );
  const [realitioQuestion, setRealitioQuestion] = useState<string>(
    'Who will win the 2020 US General Election␟"Donald Trump","Joe Biden"␟news-politics␟en_US'
  );
  const [outcomes, setOutcomes] = useState<any[]>(["Trump", "Biden"]);

  const { handleSubmit, errors, register, formState } = useForm();

  const createMarket = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const MARKET_EVENT_NAME = marketEventName;
    const MARKET_OPENING_TIME = marketOpeningTime;
    const MARKET_LOCKING_TIME = marketLockingTime;
    const MARKET_RESOLUTION_TIME = marketResolutionTime;
    const TIMEOUT = timeout;
    const ARBITRATOR = arbitrator;
    const REALITIO_QUESTION = realitioQuestion;
    const OUTCOMES = outcomes;

    let tx = await factoryContract!.createMarket(
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
    setLoading(false);
    // close;
  };

  function validateMarketEventName(value: any) {
    let error;
    if (!value) {
      error = "Name is required";
    } else if (value !== "Naruto") {
      error = "Jeez! You're not a fan 😱";
    }
    return error || true;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent backgroundColor="white.100" borderRadius="0.25rem">
          {loading ? (
            <Flex justifyContent="center" my="1rem" mx="0">
              <Spinner color="red.100" size="xl" thickness="4px" />
            </Flex>
          ) : (
            <>
              <ModalHeader>Create a Market</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={createMarket}>
                  <FormControl
                    width="100%"
                    marginBottom="1rem"
                    isInvalid={errors.name}
                  >
                    <FormLabel color="#777" htmlFor="marketEventName">
                      Market Event Name
                    </FormLabel>
                    <Input
                      borderColor="gray.100"
                      name="marketEventName"
                      type="text"
                      placeholder={marketEventName}
                      value={marketEventName}
                      ref={register({ validate: validateMarketEventName })}
                      onChange={(e: any) => setMarketEventName(e.target.value)}
                    />
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl width="100%" marginBottom="1rem">
                    <FormLabel color="#777" htmlFor="realitioQuestion">
                      Realit.io Question
                    </FormLabel>
                    <Input
                      borderColor="gray.100"
                      name="realitioQuestion"
                      type="text"
                      value={realitioQuestion}
                      onChange={(e: any) => setRealitioQuestion(e.target.value)}
                    />
                  </FormControl>
                  <FormControl width="100%" marginBottom="1rem">
                    <FormLabel color="#777" htmlFor="arbitrator">
                      Arbitrator
                    </FormLabel>
                    <Input
                      borderColor="gray.100"
                      name="arbitrator"
                      type="text"
                      value={arbitrator}
                      onChange={(e: any) => setArbitrator(e.target.value)}
                    />
                  </FormControl>
                  <Flex width="100%" marginBottom="1rem">
                    <FormControl>
                      <FormLabel color="#777" htmlFor="marketOpeningTime">
                        Opening
                      </FormLabel>
                      <Input
                        borderColor="gray.100"
                        name="marketOpeningTime"
                        type="number"
                        value={marketOpeningTime}
                        onChange={(e: any) =>
                          setMarketOpeningTime(e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="#777" htmlFor="marketLockingTime">
                        Locking
                      </FormLabel>
                      <Input
                        borderColor="gray.100"
                        name="marketLockingTime"
                        type="number"
                        value={marketLockingTime}
                        onChange={(e: any) =>
                          setMarketLockingTime(e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="#777" htmlFor="marketResolutionTime">
                        Resolution
                      </FormLabel>
                      <Input
                        borderColor="gray.100"
                        name="marketResolutionTime"
                        type="number"
                        value={marketResolutionTime}
                        onChange={(e: any) =>
                          setMarketResolutionTime(e.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel color="#777" htmlFor="timeout">
                        Timeout
                      </FormLabel>
                      <Input
                        borderColor="gray.100"
                        name="timeout"
                        type="number"
                        value={timeout}
                        onChange={(e: any) => setTimeout(e.target.value)}
                      />
                    </FormControl>
                  </Flex>
                  <FormControl marginBottom="1rem">
                    <FormLabel color="#777" htmlFor="tokens">
                      Outcomes
                    </FormLabel>
                    <Input
                      borderColor="gray.100"
                      type="text"
                      name="tokens"
                      placeholder="Token"
                      isReadOnly
                      value={outcomes}
                    />
                  </FormControl>

                  <Button
                    backgroundColor="black.100"
                    borderRadius="0.33rem"
                    color="white.100"
                    textAlign="center"
                    padding="0.8rem"
                    marginBottom="1rem"
                    width="100%"
                    cursor="pointer"
                    _hover={{ backgroundColor: "red.100" }}
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
    </>
  );
};

export default CreateMarket;
