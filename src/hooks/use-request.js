import { useCallback, useState } from "react";

const useRequest = (setPayload, isLoading = false) => {
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async ({ endpoint, headers = {}, body, method = "GET" }) => {
      const url = `/api${endpoint}`;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method,
          headers,
          body,
        });
        const data = await res.json();
        if (data.error) throw Error(data.error);
        setPayload(data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    },
    [setPayload]
  );

  return {
    loading,
    error,
    sendRequest,
  };
};

export default useRequest;
