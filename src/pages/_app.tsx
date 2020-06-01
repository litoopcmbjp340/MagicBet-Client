import React, { useState, useLayoutEffect, useEffect } from "react";
import { NextComponentType } from "next";
import NextApp from "next/app";
import Head from "next/head";
import { ThemeProvider } from "emotion-theming";
import { ColorModeProvider, CSSReset } from "@chakra-ui/core";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { ApolloProvider } from "@apollo/react-hooks";
import { Global } from "@emotion/core";

import theme, { GlobalStyle } from "theme";
import Layout from "components/Layout";
import { client } from "utils";
import { ContractProvider } from "state/contracts/Context";
import Error from "components/Error";
import SwitchChain from "components/SwitchChain";
import { ModalProvider } from "state/modals/Context";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function FunctionalApp({ Component }: { Component: NextComponentType }) {
  const [painted, setPainted] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setPainted(true);
  }, []);

  const { error, chainId } = useWeb3React();
  const requiredChainId = 42;

  return !painted ? null : (
    <>
      <Layout>
        {error ? (
          <Error />
        ) : chainId !== undefined && chainId !== requiredChainId ? (
          <SwitchChain requiredChainId={requiredChainId} />
        ) : (
          <Component />
        )}
      </Layout>
    </>
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
          <link rel="icon" type="image/x-icon" href="../static/favicon.ico" />
        </Head>
        <ContractProvider>
          <ModalProvider>
            <ApolloProvider client={client}>
              <ThemeProvider theme={theme}>
                {/* <ColorModeProvider> */}
                <CSSReset />
                <Global styles={GlobalStyle} />
                <Web3ReactProvider getLibrary={getLibrary}>
                  <FunctionalApp Component={Component} />
                </Web3ReactProvider>
                {/* </ColorModeProvider> */}
              </ThemeProvider>
            </ApolloProvider>
          </ModalProvider>
        </ContractProvider>
      </>
    );
  }
}

// serviceWorker.register();
