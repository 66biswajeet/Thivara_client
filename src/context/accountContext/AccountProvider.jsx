import request from "@/utils/axiosUtils";
import { SelfAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import AccountContext from ".";

const AccountProvider = (props) => {
  const [mobileSideBar, setMobileSideBar] = useState(false);
  const [accountData, setAccountData] = useState(() => {
    // Initialize with stored account data if available
    if (typeof window !== "undefined") {
      const storedAccount = localStorage.getItem("account");
      if (storedAccount) {
        try {
          return JSON.parse(storedAccount);
        } catch (e) {
          console.error("Error parsing stored account:", e);
        }
      }
    }
    return null;
  });
  const [authToken, setAuthToken] = useState(Cookies.get("uat"));

  const { data, refetch, fetchStatus } = useFetchQuery(
    [SelfAPI],
    () => request({ url: SelfAPI }),
    {
      enabled: false,
      select: (res) => {
        return res?.data;
      },
    }
  );

  // Check for cookie changes periodically and on refetch
  useEffect(() => {
    const checkAuth = () => {
      const currentToken = Cookies.get("uat");
      if (currentToken !== authToken) {
        setAuthToken(currentToken);
      }
    };

    // Check immediately
    checkAuth();

    // Set up interval to check for cookie changes
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, [authToken]);

  // Fetch user data when auth token is available
  useEffect(() => {
    if (authToken) {
      refetch();
    } else {
      // Clear account data when logged out
      setAccountData(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("account");
        Cookies.remove("account");
      }
    }
  }, [authToken]);

  useEffect(() => {
    if (data) {
      setAccountData(data);
      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("account", JSON.stringify(data));
      }
    }
  }, [fetchStatus == "fetching", data]);

  return (
    <AccountContext.Provider
      value={{
        ...props,
        accountData,
        setAccountData,
        refetch,
        mobileSideBar,
        setMobileSideBar,
        authToken,
        setAuthToken,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
