import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [42],
});

export function getNetwork(defaultChainId = 42): NetworkConnector {
  return new NetworkConnector({
    urls: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`,
    defaultChainId,
    pollingInterval: 15 * 1000,
  });
}
