import React, { useState, useLayoutEffect, useEffect } from 'react';
import { NextComponentType } from 'next';
import NextApp from 'next/app';
import Head from 'next/head';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Global } from '@emotion/core';
import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import 'react-datepicker/dist/react-datepicker.css';
// import * as serviceWorker from '../serviceWorker';

import { ContractProvider } from '../state/contracts/Context';
import Layout from '../components/Layout';
import Error from '../components/Error';
import SwitchChain from '../components/SwitchChain';
import theme, { GlobalStyle } from '../utils/theme';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Application({ Component }: { Component: NextComponentType }) {
  const [painted, setPainted] = useState<boolean>(false);
  useIsomorphicLayoutEffect(() => {
    setPainted(true);
  }, []);

  const { error, chainId } = useWeb3React();

  return !painted ? null : (
    <Layout>
      {error ? (
        <Error />
      ) : typeof chainId !== 'number' ? null : chainId !== 42 ? (
        <SwitchChain />
      ) : (
        <Component />
      )}
    </Layout>
  );
}

export default class App extends NextApp {
  render() {
    const { Component } = this.props;

    function getLibrary(provider: any): Web3Provider {
      return new Web3Provider(provider);
    }

    return (
      <>
        {/* <Head>
          <title key="title">MagicBet</title>
          <meta
            key="description"
            name="Description"
            content="The MagicBet Client"
          />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link
            key="favicon"
            rel="icon"
            type="image/x-icon"
            href="/favicon.ico"
          />
          <html lang="en" />
        </Head> */}
        <Head>
          <title key="title">MagicBet</title>
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ContractProvider>
            <ThemeProvider theme={theme}>
              <ColorModeProvider>
                <CSSReset />
                <Global styles={GlobalStyle} />
                <Application Component={Component} />
              </ColorModeProvider>
            </ThemeProvider>
          </ContractProvider>
        </Web3ReactProvider>
      </>
    );
  }
}

// serviceWorker.register();
