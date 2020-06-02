import { providers } from "ethers";

export async function useNetworkId() {
  let provider = new providers.Web3Provider(window.web3.currentProvider);
  let networkId = await provider.getNetwork();
  return networkId;
}
