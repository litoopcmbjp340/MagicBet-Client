import React, { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import {
  Box,
  Flex,
  Heading,
  Button,
  Tag,
  Stack,
  useColorMode,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Spinner,
} from '@chakra-ui/core';

import { bgColor1, color1, bgColor6, bgColor8 } from '../../utils/theme';
import CreateMarket from '../../components/Modals/CreateMarket';
import MBMarketContract from '../../abis/MBMarket.json';
import { shortenAddress } from '../../utils';
import { ContractContext } from '../../state/contracts/Context';

const Admin = (): JSX.Element => {
  const { account, active, library } = useWeb3React<Web3Provider>();
  const { colorMode } = useColorMode();
  const createMarketModalToggle = useDisclosure();

  const { contracts } = useContext(ContractContext);
  const FactoryContract = contracts[0];

  const [factoryContract, setFactoryContract] = useState<Contract>();
  const [loading, setLoading] = useState<boolean>(true);

  const [marketContract, setMarketContract] = useState<Contract | null>();

  const [contractAddress, setContractAddress] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    if (!!library) setFactoryContract(FactoryContract.connect(library));
  }, [library]);

  useEffect(() => {
    (async () => {
      let isStale = false;
      try {
        if (!isStale && factoryContract !== undefined) {
          if (!!library) FactoryContract.connect(library);
          const mostRecentAddress = await factoryContract.mostRecentContract();

          if (mostRecentAddress !== AddressZero && !!library && !!account) {
            setContractAddress(mostRecentAddress + '');
            const marketContract = new Contract(
              mostRecentAddress,
              MBMarketContract.abi,
              library.getSigner(account)
            );

            const isPaused = await marketContract.paused();
            if (isPaused) setMarketContract(undefined);
            else setMarketContract(marketContract);

            factoryContract.on('MarketCreated', (address: any) => {
              const marketInstance = new Contract(
                address,
                MBMarketContract.abi,
                library.getSigner(account)
              );
              setMarketContract(marketInstance);
            });
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
      return () => {
        isStale = true;
      };
    })();
  }, [factoryContract]);

  const removeContract = async () => {
    await marketContract!.disableContract();
    // dispatch({ type: REMOVE_MARKET_CONTRACT, address: contract.address });
  };

  return (
    <Box bg={bgColor1[colorMode]} pb="1rem" rounded="md" boxShadow="md">
      <Box roundedTop="0.25rem" bg="primary.100" h="0.5rem" />
      <Flex justify="space-between" align="center" p="1rem 1.5rem">
        <Heading
          as="h3"
          size="lg"
          fontSize="1.5rem"
          font-weight="500"
          color={color1[colorMode]}
        >
          Admin
        </Heading>
      </Flex>

      <Flex wrap="wrap" direction="column" justify="center" align="center">
        {loading && <Spinner />}

        {!loading && (
          <>
            {marketContract === undefined ? (
              <Button
                bg={bgColor6[colorMode]}
                border="none"
                borderRadius="0.33rem"
                color="light.100"
                text-Align="center"
                fontSize="1rem"
                p="0.8rem"
                w="auto"
                cursor="pointer"
                _hover={{ bg: 'primary.100' }}
                isDisabled={!active}
                onClick={createMarketModalToggle.onOpen}
              >
                Create Market
              </Button>
            ) : (
              <Box
                maxW="sm"
                borderWidth="1px"
                rounded="lg"
                bg={bgColor8[colorMode]}
                textAlign="center"
              >
                <Box p="6">
                  <Tag
                    variantColor="gray"
                    mb="0.25rem"
                  >{`Contract ${shortenAddress(contractAddress)}`}</Tag>
                  <Stack>
                    <Button
                      my="0.25rem"
                      color="light.100"
                      bg={bgColor6[colorMode]}
                      _hover={{ bg: 'primary.100' }}
                      onClick={async () =>
                        await marketContract!.determineWinner()
                      }
                    >
                      Determine Winner
                    </Button>
                    <Button
                      my="0.25rem"
                      color="light.100"
                      bg={bgColor6[colorMode]}
                      _hover={{ bg: 'primary.100' }}
                      onClick={() => removeContract()}
                    >
                      Disable Contract
                    </Button>
                  </Stack>
                  {alert && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>Invalid Call!</AlertTitle>
                      <AlertDescription>
                        You cannot call this function at this time.
                      </AlertDescription>
                      <CloseButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={() => setAlert(false)}
                      />
                    </Alert>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Flex>
      <CreateMarket createMarketModalToggle={createMarketModalToggle} />
    </Box>
  );
};

export default Admin;
