import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import addresses, { KOVAN_ID } from 'utils/addresses';
import IERC20 from 'abis/IERC20.json';

export default function useDaiContract(): Contract | undefined {
  const { library, account } = useWeb3React<Web3Provider>();

  return useMemo(
    () =>
      !!library
        ? new Contract(
            addresses[KOVAN_ID].tokens.DAI,
            IERC20.abi,
            library.getSigner(account!)
          )
        : undefined,
    [library, account]
  );
}
