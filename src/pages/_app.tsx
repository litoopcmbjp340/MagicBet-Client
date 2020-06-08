import React, { useState, useLayoutEffect, useEffect } from "react";
import { NextComponentType } from "next";
import NextApp from "next/app";
import Head from "next/head";
import { resolve } from "url";
import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { Global } from "@emotion/core";

import Layout from "components/Layout";
import Error from "components/Error";
import SwitchChain from "components/SwitchChain";
import theme, { GlobalStyle } from "theme";
import { ContractProvider } from "state/contracts/Context";
import { ModalProvider } from "state/modals/Context";
import { BetProvider } from "state/bet/Context";

import "../components/Modals/CreateMarket/react-datepicker.css";
import "../components/Modals/CreateMarket/customReactDatePickerStyles.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Application({ Component }: { Component: NextComponentType }) {
  const [painted, setPainted] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setPainted(true);
  }, []);

  const { error, chainId } = useWeb3React();

  return !painted ? null : (
    <>
      <Head>
        <base
          key="base"
          href={
            process.env.IPFS === "true"
              ? resolve(
                  window.location.origin,
                  window.location.pathname
                    .split("/")
                    .slice(0, 3)
                    .join("/") + "/"
                )
              : window.location.origin
          }
        />
      </Head>
      <ContractProvider>
        <Layout>
          {error ? (
            <Error />
          ) : chainId !== undefined && chainId !== 42 ? (
            <SwitchChain requiredChainId={42} />
          ) : (
            <Component />
          )}
        </Layout>
      </ContractProvider>
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
          <link
            key="favicon"
            rel="icon"
            type="image/x-icon"
            href="/favicon.ico"
          />
        </Head>

        <Web3ReactProvider getLibrary={getLibrary}>
          <ModalProvider>
            <BetProvider>
              <ThemeProvider theme={theme}>
                <ColorModeProvider>
                  <CSSReset />
                  <Global styles={GlobalStyle} />
                  <Application Component={Component} />
                </ColorModeProvider>
              </ThemeProvider>
            </BetProvider>
          </ModalProvider>
        </Web3ReactProvider>
      </>
    );
  }
}

// serviceWorker.register();
