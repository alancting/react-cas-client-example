import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CasClient, { constant } from "react-cas-client";
import { CasUserContext } from "./context/casUserContext";

const useCas = (attempLoginWithGateway = false) => {
  const history = useHistory();

  const casUserContext = useContext(CasUserContext);
  const [isLoading, setIsLoading] = useState(false);

  const casClient = new CasClient(process.env.REACT_APP_CAS_ENDPOINT, {
    version: constant.CAS_VERSION_3_0,
  });

  useEffect(() => {
    if (!casUserContext.user) {
      (async function () {
        try {
          await attemptCasLogin(attempLoginWithGateway);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  function attemptCasLogin(gateway) {
    return new Promise((resolve, reject) => {
      casClient
        .auth(gateway)
        .then((successRes) => {
          // Login user in state / locationStorage ()
          // eg. loginUser(response.user);
          casUserContext.setUser(successRes.user);
          // Update current path to trim any extra params in url
          // eg. this.props.history.replace(response.currentPath);
          setIsLoading(false);
          history.replace(successRes.currentPath);
        })
        .catch((errorRes) => {
          setIsLoading(false);
          history.replace(errorRes.currentPath);
          reject(errorRes);
        });
    });
  }

  function logout(path = "/") {
    casClient.logout("/");
  }

  return { isLoading, attemptCasLogin, logout };
};

export default useCas;
