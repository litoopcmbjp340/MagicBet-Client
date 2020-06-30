import React, { useState, useLayoutEffect, useEffect } from 'react';
import { NextComponentType } from 'next';
import NextApp from 'next/app';
import Head from 'next/head';
import { Web3Provider } from '@ethersproject/providers';
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { Global } from '@emotion/core';
import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import 'react-datepicker/dist/react-datepicker.css';
import '../utils/customDatePickerStyles.css';
// import * as serviceWorker from '../serviceWorker';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/core';

import { ContractProvider } from '../state/contracts/Context';
import { AppProvider } from '../state/app/Context';
import Layout from '../components/Layout';
import Error from '../components/Error';
import theme, { GlobalStyle } from '../utils/theme';

function getErrorMessage(error: any) {
  if (error instanceof NoEthereumProviderError)
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  else if (error instanceof UnsupportedChainIdError)
    return "You're connected to an unsupported network.";
  else if (error instanceof UserRejectedRequestErrorInjected)
    return 'Please authorize this website to access your Ethereum account.';
  else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Application({ Component }: { Component: NextComponentType }) {
  const [painted, setPainted] = useState<boolean>(false);
  const { error } = useWeb3React();

  useIsomorphicLayoutEffect(() => {
    setPainted(true);
  }, []);

  return !painted ? null : (
    <Layout>
      {!!error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{getErrorMessage(error)}</AlertTitle>
          <AlertDescription>
            &nbsp;Please connect to Kovan and try again.
          </AlertDescription>
        </Alert>
      )}
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
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ContractProvider>
            <AppProvider>
              <ThemeProvider theme={theme}>
                <ColorModeProvider>
                  <CSSReset />
                  <Global styles={GlobalStyle} />
                  <Application Component={Component} />
                </ColorModeProvider>
              </ThemeProvider>
            </AppProvider>
          </ContractProvider>
        </Web3ReactProvider>
      </>
    );
  }
}

// serviceWorker.register();
