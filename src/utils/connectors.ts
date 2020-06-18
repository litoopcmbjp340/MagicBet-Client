import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

const RPC_URLS: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  42: `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
};

export function getNetwork(defaultChainId = 1): NetworkConnector {
  const network = new NetworkConnector({
    urls: { 1: RPC_URLS[1], 42: RPC_URLS[42] },
    defaultChainId,
  });
  return network;
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 42],
});
