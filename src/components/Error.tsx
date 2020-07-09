import React from 'react';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/core';

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

export default function Error({ error }: any): JSX.Element {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{getErrorMessage(error)}</AlertTitle>
      <AlertDescription>
        &nbsp;Please connect to Kovan and try again.
      </AlertDescription>
    </Alert>
  );
}
