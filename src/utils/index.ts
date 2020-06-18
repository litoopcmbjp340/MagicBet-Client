import { Contract } from '@ethersproject/contracts';
import { parseUnits } from '@ethersproject/units';

import DaiMockup from '../abis/DaiMockup.json';
import addresses, { KOVAN_ID } from '../utils/addresses';

const daiAddress = addresses[KOVAN_ID].tokens.DAI;

export const shortenAddress = (address: string): string => {
  return address.slice(0, 5) + '...' + address.slice(address.length - 4);
};

export const mintDai = async (wallet: any) => {
  const daiMockupContract: Contract = new Contract(
    daiAddress,
    DaiMockup.abi,
    wallet
  );
  const formattedDaiToMint = parseUnits('100', 18);
  try {
    const tx = await daiMockupContract.mint(formattedDaiToMint);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
};

export function getEthNetworkNameById(networkId: number | undefined): string {
  let networkName = '';

  switch (networkId) {
    case 1:
      networkName = 'Main';
      break;
    case 3:
      networkName = 'Ropsten';
      break;
    case 4:
      networkName = 'Rinkeby';
      break;
    case 5:
      networkName = 'Goerli';
      break;
    case 42:
      networkName = 'Kovan';
      break;
    default:
      networkName = 'Custom';
      break;
  }
  return networkName;
}

export const getFormattedNumber = (floatBalance: number, decimals: number) => {
  if (floatBalance === 0) {
    return 0;
  } else if (floatBalance < 1) {
    const decimalDigits = floatBalance.toFixed(decimals).slice(2);
    const leadingZeros = decimalDigits.search(/[1-9]/);
    const firstTwoDigits = decimalDigits.slice(leadingZeros, leadingZeros + 2);

    return `0.${'0'.repeat(leadingZeros)}${firstTwoDigits}`;
  } else if (floatBalance < 10) return Math.round(floatBalance * 10) / 10;

  return Math.round(floatBalance);
};
