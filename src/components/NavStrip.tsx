import React, { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Flex, Box, Icon, Text, useColorMode } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { FiHome, FiCalendar, FiEdit2 } from 'react-icons/fi';

import { ContractContext } from '../state/contracts/Context';
import { checkOwner } from '../utils';
import { bgColor4 } from '../utils/theme';

const StyledLink = styled.a<{ active: boolean }>`
    display: flex;
    align-items: center;
    padding: 1rem 0;
    text-decoration: none;
    border-bottom-width: 2px;
    color: ${({ active }) => (active ? '#f4f5f9' : '#eceffb')};
    border-bottom-color: ${({ active }) => (active ? '#f4f5f9' : 'transparent')};
    &:hover {
        color: #f4f5f9;
        border-bottom-color: #f4f5f9;
        border-bottom-width: 2px;
    }
`;

const NavStrip = (): JSX.Element => {
    console.log('bgColor4:', bgColor4);
    const { pathname } = useRouter();
    const { colorMode } = useColorMode();

    const { account, library, connector } = useWeb3React<Web3Provider>();

    const { contracts } = useContext(ContractContext);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        if (!!library && !!account) {
            let isStale = false;
            const factoryInstance = contracts[0].connect(library);
            factoryInstance.owner().then((res: string) => {
                if (!isStale) setIsOwner(checkOwner(account, res));
            });
            return () => {
                isStale = true;
                setIsOwner(false);
            };
        }
    }, [library, connector, account]);

    return (
        <Box w="100%" m="0 auto" bg={bgColor4[colorMode]} display={{ xs: 'none', sm: 'none', md: 'block' }}>
            <Flex as="nav" justify="center">
                <Flex mr="2rem" fontSize="1.25rem">
                    <NextLink href="/dashboard" passHref>
                        <StyledLink active={pathname === '/dashboard'}>
                            <FiHome aria-label="Dashboard" />
                            <Text ml="0.25rem">Dashboard</Text>
                        </StyledLink>
                    </NextLink>
                </Flex>
                <Flex mr="2rem" fontSize="1.25rem">
                    <NextLink href="/markets" passHref>
                        <StyledLink active={pathname === '/markets'}>
                            <FiCalendar aria-label="Markets" />
                            <Text ml="0.25rem">Markets</Text>
                        </StyledLink>
                    </NextLink>
                </Flex>
                {isOwner && (
                    <Flex mr="2rem" fontSize="1.25rem">
                        <NextLink href="/admin" passHref>
                            <StyledLink active={pathname === '/admin'}>
                                <FiEdit2 aria-label="Admint" />
                                <Text ml="0.25rem">Admin</Text>
                            </StyledLink>
                        </NextLink>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

export default NavStrip;
