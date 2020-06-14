import { Web3Provider } from '@ethersproject/providers';

export default async function useNetworkId() {
  let provider = new Web3Provider(window.web3.currentProvider);
  let networkId = await provider.getNetwork();
  return networkId;
}
