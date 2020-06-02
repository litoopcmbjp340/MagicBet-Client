import Box from "3box";

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
