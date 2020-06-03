import { useState, useEffect } from "react";
import Box from "3box";

const checkForBox = async (account: string | null | undefined) => {
  try {
    await Box.getProfile(account);
    return true;
  } catch (err) {
    return false;
  }
};

interface IProfile {
  name: string;
  email: string;
  fetchedBox: boolean;
  loading: boolean;
}

export default function use3Box(account: string | null | undefined) {
  const [profile, setProfile] = useState<IProfile>({
    name: "",
    email: "",
    fetchedBox: false,
    loading: true,
  });

  const getBox = async () => {
    const hasBox = await checkForBox(account);
    if (!hasBox) setProfile({ ...profile, fetchedBox: true, loading: false });
    else {
      const profile = await Box.getProfile(account);
      setProfile({ ...profile, name: profile.name });
      const boxProvider = await Box.get3idConnectProvider();
      const box = await Box.openBox(account, boxProvider);
      await box.syncDone;

      const email = await box.private.get("email");
      setProfile({ ...profile, email: email });
    }
  };

  useEffect(() => {
    if (account && !profile.fetchedBox) getBox();
  });

  return profile;
}
