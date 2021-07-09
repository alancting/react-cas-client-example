# Example for alancting/react-cas-client

Example included a basic CAS server and react client using **[alancting/react-cas-client](https://github.com/alancting/react-cas-client)**

## How to start

1. Install [Docker](https://www.docker.com/) in your local machine
2. Run the example containers
```shell
$ docker-compose build
$ docker-compose up
```
3. Open browser, go to https://127.0.0.1:15443/cas/login (Make sure the local CAS server is running, it might take a while)
    - You might also facing error cert issue when you're using Chrome on Mac
        - https://stackoverflow.com/a/60987260
4. Open browser, go to http://127.0.0.1:15300, and login with follows account
    - Username: casuser
    - Password: Mellon
