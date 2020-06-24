import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

const RPC_URLS: { [chainId: number]: string } = {
  42: process.env.NEXT_PUBLIC_KOVAN_NETWORK_URL as string,
};

export function getNetwork(defaultChainId = 42): NetworkConnector {
  return new NetworkConnector({
    urls: { 42: RPC_URLS[42] },
    defaultChainId,
  });
}

export const injected = new InjectedConnector({
  supportedChainIds: [42],
});
