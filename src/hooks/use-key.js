import { useEffect } from "react";

const useKey = (key, callback) => {
  useEffect(() => {
    const deactivate = (e) => {
      if (e.key === key) callback(e);
    };
    window.addEventListener("keydown", deactivate);
    return () => window.removeEventListener("keydown", deactivate);
  }, [key, callback]);
};

export default useKey;
