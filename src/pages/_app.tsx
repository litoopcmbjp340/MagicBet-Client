import React, { useState, useLayoutEffect, useEffect } from 'react';
import { NextComponentType } from 'next';
import NextApp from 'next/app';
import Head from 'next/head';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Global } from '@emotion/core';
import { CSSReset, ChakraProvider } from '@chakra-ui/core';

import theme, { GlobalStyle } from '../utils/theme';
import { ContractProvider } from '../state/contracts/Context';
import Layout from '../components/Layout';
import Error from '../components/Error';
import 'react-datepicker/dist/react-datepicker.css';
import '../utils/customDatePickerStyles.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Application({ Component }: { Component: NextComponentType }) {
    const [ready, setReady] = useState(false);
    const { error } = useWeb3React();

    useIsomorphicLayoutEffect(() => {
        setReady(true);
    }, []);

    return !ready ? null : (
        <Layout>
            {!!error && <Error error={error} />}
            <Component />
        </Layout>
    );
}

function getLibrary(provider: any): Web3Provider {
    return new Web3Provider(provider);
}

export default class App extends NextApp {
    render() {
        const { Component } = this.props;

        return (
            <>
                <Head>
                    <title key="title">MagicBet</title>
                    <meta name="description" content="Lossless, Crypto Betting" />
                </Head>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <ContractProvider>
                        <ChakraProvider theme={theme}>
                            <CSSReset />
                            <Global styles={GlobalStyle} />
                            <Application Component={Component} />
                        </ChakraProvider>
                    </ContractProvider>
                </Web3ReactProvider>
            </>
        );
    }
}
