import { utils, Contract } from "ethers";
import DaiMockup from "abis/DaiMockup.json";
import addresses, { KOVAN_ID } from "utils/addresses";
const daiAddress = addresses[KOVAN_ID].tokens.DAI;

export const shortenAddress = (address: string): string => {
  address = address.slice(0, 5) + "..." + address.slice(address.length - 4);
  return address;
};

export const mintDai = async (wallet: any) => {
  const daiMockupContract: any = new Contract(
    daiAddress,
    DaiMockup.abi,
    wallet
  );
  let formattedDaiToMint = utils.parseUnits("100", 18);
  try {
    let tx = await daiMockupContract.mint(formattedDaiToMint);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
};

export function getEthNetworkNameById(networkId: number | undefined): string {
  let networkName = "";

  switch (networkId) {
    case 1:
      networkName = "Main";
      break;
    case 3:
      networkName = "Ropsten";
      break;
    case 4:
      networkName = "Rinkeby";
      break;
    case 5:
      networkName = "Goerli";
      break;
    case 42:
      networkName = "Kovan";
      break;
    default:
      networkName = "Custom";
      break;
  }
  return networkName;
}
