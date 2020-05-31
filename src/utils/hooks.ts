import { useState, useEffect, useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { providers } from "ethers";

import { injected } from "./connectors";

// import Box from "3box";

// const checkForBox = async (account: any) => {
//   try {
//     // this call throws an error if the box DNE
//     await Box.getProfile(account);
//     return true;
//   } catch (err) {
//     return false;
//   }
// };

// export const use3Box = (account: any) => {
//   const [box, setBox] = useState({
//     name: "",
//     email: "",
//     image: [""],
//     fetchedBox: false,
//     loading: true,
//   });

//   const getBox = async () => {
//     const hasBox = await checkForBox(account);
//     if (!hasBox) setBox({ ...box, fetchedBox: true, loading: false });
//     else {
//       const openedBox = await Box.openBox(account, window.web3.currentProvider);
//       openedBox.onSyncDone(async () => {
//         const box = await openedBox.public.all();
//         const email = await box.private.get("email");
//         console.log("email:", email);
//         console.log("box:", box);
//         setBox({ ...box, fetchedBox: true, loading: false });
//       });
//     }
//   };

//   useEffect(() => {
//     if (account && !box.fetchedBox) getBox();
//   });

//   return box;
// };

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized)
        activate(injected, undefined, true).catch(() => setTried(true));
      else setTried(true);
    });
  }, [activate]);

  useEffect(() => {
    if (!tried && active) setTried(true);
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };

      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) activate(injected);
      };

      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

export function useOnClickOutside({ ref, handler }: any) {
  useEffect(
    () => {
      const listener = ({ event }: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export async function useNetworkId() {
  let provider = new providers.Web3Provider(window.web3.currentProvider);
  let networkId = await provider.getNetwork();
  return networkId;
}

export function useEscapeKey(
  onKeyDown: (event?: any) => void,
  suppress = false
): void {
  const downHandler = useCallback(
    (event) => {
      if (!suppress && event.keyCode === 27) onKeyDown(event);
    },
    [onKeyDown, suppress]
  );
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return (): void => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [downHandler, suppress]);
}

export function useContract(
  address?: string,
  ABI?: any,
  withSigner = false
): Contract | undefined {
  const { library, account } = useWeb3React();
  return useMemo(
    () =>
      !!address && !!ABI && !!library
        ? new Contract(
            address,
            ABI,
            withSigner ? library.getSigner(account).connectUnchecked() : library
          )
        : undefined,
    [address, ABI, withSigner, library, account]
  );
}
