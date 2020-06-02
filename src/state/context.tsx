const x = 1;
export default x;
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";

// //get ourselves keys
// enum LocalStorageKeys {
//   Deadline = "deadline",
// }

// function useLocalStorage<T>(
//   key: LocalStorageKeys,
//   defaultValue: T,
//   {
//     serialize,
//     deserialize,
//   }: {
//     serialize: (toSerialize: T) => any;
//     deserialize: (toDeserialize: any) => T;
//   } = {
//     serialize: (toSerialize) => toSerialize,
//     deserialize: (toDeserialize) => toDeserialize,
//   }
// ): [T, (value: T) => void] {
//   const [value, setValue] = useState(() => {
//     try {
//       return (
//         deserialize(JSON.parse(window.localStorage.getItem(key)!)) ??
//         defaultValue
//       );
//     } catch {
//       return defaultValue;
//     }
//   });

//   useEffect(() => {
//     try {
//       window.localStorage.setItem(key, JSON.stringify(serialize(value)));
//     } catch {}
//   }, [key, serialize, value]);

//   return [value, setValue];
// }

// const LocalStorageContext = createContext<
//   [
//     {
//       deadline: number;
//     },
//     {
//       setDeadline: (deadline: number) => void;
//     }
//   ]
// >([] as any);

// function useLocalStorageContext() {
//   return useContext(LocalStorageContext);
// }

// export default function Provider({ children }: any) {
//   const [deadline, setDeadline] = useLocalStorage<number>(
//     LocalStorageKeys.Deadline,
//     60 * 15
//   );

//   return (
//     <LocalStorageContext.Provider
//       value={useMemo(
//         () => [
//           { deadline },
//           {
//             setDeadline,
//           },
//         ],
//         [deadline, setDeadline]
//       )}
//     >
//       {children}
//     </LocalStorageContext.Provider>
//   );
// }

// export function useDeadline(): [number, (deadline: number) => void] {
//   const [{ deadline }, { setDeadline }] = useLocalStorageContext();
//   return [deadline, setDeadline];
// }
