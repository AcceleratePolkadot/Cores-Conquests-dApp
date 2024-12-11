import type React from "react";
import { useEffect, useState } from "react";

const useDelayedRender = (delay: number, placeholder?: React.ReactElement) => {
  const [delayed, setDelayed] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return (fn: () => React.ReactElement) => (!delayed ? fn() : placeholder);
};

export default useDelayedRender;
