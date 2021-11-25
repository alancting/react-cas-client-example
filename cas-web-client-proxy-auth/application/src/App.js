import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Button, Box, Text, Paragraph, Spinner, Heading } from "grommet";
import { Login, Logout } from "grommet-icons";
import { useHistory } from "react-router-dom";
import useCas from "./useCas";
import { CasUserContext } from "./context/casUserContext";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/home">
          <SecureHome />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
}

function Layout(props) {
  const history = useHistory();
  const [securityChecked, setSecurityChecked] = useState(false);
  const casUserContext = useContext(CasUserContext);

  useEffect(() => {
    if (props.isSecure && !casUserContext.user) {
      history.replace("/");
    } else {
      setSecurityChecked(true);
    }
  }, [props.isSecure, casUserContext]);

  if (!securityChecked) return <Box></Box>;

  return (
    <Box align="center" background={props.background} fill>
      <Heading
        margin={{
          top: "xlarge",
          bottom: "none",
        }}
      >
        React CAS Client Example
      </Heading>
      <Heading
        margin={{
          top: "none",
          bottom: "medium",
        }}
        size="small"
      >
        (Proxy Web Flow)
      </Heading>
      <Box justify="center" align="center">
        {props.children}
      </Box>
    </Box>
  );
}

function Home() {
  const history = useHistory();

  const casUserContext = useContext(CasUserContext);
  const cas = useCas(true);

  useEffect(() => {
    if (casUserContext.user) {
      history.replace("/home");
    }
  }, [casUserContext]);

  return (
    <Layout background="status-unknown" isSecure={false}>
      {cas.isLoading && (
        <Box align="center" gap="medium">
          <Spinner
            border={[
              {
                side: "all",
                color: "brand",
                size: "medium",
                style: "dotted",
              },
            ]}
          />
          <Text>Redirecting ...</Text>
        </Box>
      )}
      {!cas.isLoading && (
        <Box align="center" gap="xsmall">
          <Paragraph textAlign="center">
            Hello anonymous! Please click{" "}
            <Text color="brand" size="large">
              LOGIN
            </Text>{" "}
            with follows account.
          </Paragraph>
          <Box align="center" gap="xsmall" direction="column">
            <Text size="xsmall">Username / Password</Text>
            <Text size="large">
              <Text color="brand" size="large">
                casuser
              </Text>{" "}
              /{" "}
              <Text color="brand" size="large">
                Mellon
              </Text>
            </Text>
          </Box>
          <Button
            label="Login"
            icon={<Login />}
            a11yTitle="Login button"
            margin="medium"
            reverse
            onClick={() => {
              cas.attemptCasLogin(false);
            }}
          />
        </Box>
      )}
    </Layout>
  );
}

function SecureHome() {
  const casUserContext = useContext(CasUserContext);
  const [apiPt, setApiPt] = useState("");
  const [fetchingApiPt, setFetchingApiPt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [grantingApiAccess, setGrantingApiAccess] = useState(false);
  const [apiAccessGranted, setApiAccessGranted] = useState(false);
  const cas = useCas();

  useEffect(() => {
    setMounted(true);
    return function cleanup() {
      setMounted(false);
    };
  });

  useEffect(() => {
    if (mounted && casUserContext.pgtIou && !apiPt && !fetchingApiPt) {
      getProxyTicketForApi();
    }
  }, [casUserContext, mounted]);

  useEffect(() => {
    if (mounted && apiPt && !grantingApiAccess) {
      grantApiAccess();
    }
  }, [mounted, apiPt]);

  function getProxyTicketForApi() {
    setFetchingApiPt(true);
    fetch(
      process.env.REACT_APP_PROXY_AUTH_ENDPOINT +
        "/cas/pt?pgtiou=" +
        casUserContext.pgtIou +
        "&service=" +
        encodeURIComponent(process.env.REACT_APP_API_ENDPOINT)
    )
      .then((response) => {
        response
          .json()
          .then((result) => {
            if (result.pt) {
              setApiPt(result.pt);
            }
            setFetchingApiPt(false);
          })
          .catch((error) => {
            console.error(error);
            setFetchingApiPt(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setFetchingApiPt(false);
      });
  }

  function grantApiAccess() {
    setGrantingApiAccess(true);
    fetch(process.env.REACT_APP_API_ENDPOINT + "/api/grant_access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pt: apiPt }),
    })
      .then((response) => {
        response
          .json()
          .then((result) => {
            if (result.status) {
              setApiAccessGranted(true);
            }
            setGrantingApiAccess(false);
          })
          .catch((error) => {
            console.error(error);
            setGrantingApiAccess(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setGrantingApiAccess(false);
      });
  }

  return (
    <Layout background="status-ok" isSecure={true}>
      <Box align="center" gap="medium">
        <Paragraph textAlign="center">
          welome{" "}
          <Text color="brand" size="xxlarge">
            {casUserContext.user}
          </Text>
        </Paragraph>
      </Box>
      {apiAccessGranted && (
        <Button
          primary
          label="Get ME From Api"
          a11yTitle="Get ME From Api"
          margin={{ bottom: "medium" }}
          onClick={() => {
            fetch(process.env.REACT_APP_API_ENDPOINT + "/api/me", {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + apiPt,
              },
            })
              .then((response) => {
                response
                  .text()
                  .then((result) => {
                    alert(result);
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      )}
      <Button
        label="Logout"
        icon={<Logout />}
        a11yTitle="Logout button"
        reverse
        onClick={() => {
          cas.logout();
        }}
      />
    </Layout>
  );
}

function NoMatch() {
  const history = useHistory();

  return (
    <Layout background="status-critical" isSecure={false}>
      <Box align="center" gap="medium">
        <Paragraph textAlign="center">Page Not Found.</Paragraph>
        <Button
          label="Go Back"
          color="white"
          a11yTitle="Go Back button"
          onClick={() => {
            history.replace("/");
          }}
        />
      </Box>
    </Layout>
  );
}
