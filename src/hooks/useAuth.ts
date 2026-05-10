import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Placeholder for auth state checks.
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
  };
};

export default useAuth;
