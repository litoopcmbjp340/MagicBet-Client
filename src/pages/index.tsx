import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Redirect(): null {
  const { replace } = useRouter();
  useEffect(() => {
    replace('/dashboard');
  }, [replace]);
  return null;
}
