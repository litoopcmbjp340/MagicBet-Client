import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  42: `https://kovan.infura.io/v3/${INFURA_KEY}`,
};

// Change to 1 when deployed
export function getNetwork(defaultChainId = 42): NetworkConnector {
  return new NetworkConnector({
    urls: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
    defaultChainId,
  });
}

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
  defaultChainId: 42,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 42],
});
