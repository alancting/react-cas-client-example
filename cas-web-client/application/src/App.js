import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Button, Box, Text, Paragraph, Spinner, Heading } from "grommet";
import { Login, Logout } from "grommet-icons";
import { useHistory } from "react-router-dom";
import CasClient, { constant } from "react-cas-client";

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
  const [user] = useContext(CasUserContext);

  useEffect(() => {
    if (props.isSecure && !user) {
      history.replace("/");
    } else {
      setSecurityChecked(true);
    }
  }, [props.isSecure, user]);

  if (!securityChecked) return <Box></Box>;

  return (
    <Box align="center" background={props.background} fill>
      <Heading
        margin={{
          top: "xlarge",
          bottom: "medium",
        }}
      >
        React CAS Client Example
      </Heading>
      <Box justify="center" align="center">
        {props.children}
      </Box>
    </Box>
  );
}

function Home() {
  const history = useHistory();

  const [user, setUser] = useContext(CasUserContext);
  const [isLoading, setIsLoading] = useState(false);

  const casClient = new CasClient(process.env.REACT_APP_CAS_ENDPOINT, {
    version: constant.CAS_VERSION_3_0,
  });

  useEffect(() => {
    if (!user) {
      attemptCasLogin(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      history.replace("/home");
    }
  }, [user]);

  function attemptCasLogin(gateway) {
    setIsLoading(true);
    casClient
      .auth(gateway)
      .then((successRes) => {
        // Login user in state / locationStorage ()
        // eg. loginUser(response.user);
        setUser(successRes.user);
        setIsLoading(false);
        // Update current path to trim any extra params in url
        // eg. this.props.history.replace(response.currentPath);
        history.replace(successRes.currentPath);
      })
      .catch((errorRes) => {
        setIsLoading(false);
        history.replace(errorRes.currentPath);
      });
  }

  return (
    <Layout background="status-unknown" isSecure={false}>
      {isLoading && (
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
      {!isLoading && (
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
              attemptCasLogin(false);
            }}
          />
        </Box>
      )}
    </Layout>
  );
}

function SecureHome() {
  const casClient = new CasClient(process.env.REACT_APP_CAS_ENDPOINT, {
    version: constant.CAS_VERSION_3_0,
  });
  const [user] = useContext(CasUserContext);

  return (
    <Layout background="status-ok" isSecure={true}>
      <Box align="center" gap="medium">
        <Paragraph textAlign="center">
          welome{" "}
          <Text color="brand" size="xxlarge">
            {user}
          </Text>
        </Paragraph>
      </Box>
      <Button
        label="Logout"
        icon={<Logout />}
        a11yTitle="Logout button"
        reverse
        onClick={() => {
          casClient.logout("/");
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
