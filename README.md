# Example for alancting/react-cas-client

Example included a basic CAS server and react client using **[alancting/react-cas-client](https://github.com/alancting/react-cas-client)**

## How to start

1. Install [Docker](https://www.docker.com/) in your local machine
2. Run the example containers
```shell
$ docker-compose build
$ docker-compose up
```
3. Open browser, go to https://127.0.0.1/cas/login (Make sure the local CAS server is running, it might take a while)
    - You might also facing error cert issue when you're using Chrome on Mac
        - https://stackoverflow.com/a/60987260

### For CAS Web Flow
1. Open browser, go to http://127.0.0.1:15300 (**cas-web-client**), 
2. Click login, you will be redirect to CAS login page (**cas-server**)
3. Login with follows account
    - Username: casuser
    - Password: Mellon
4. You will be redirect back to the http://127.0.0.1:15300 (**cas-web-client**)
5. You're now logged in with CAS :heavy_check_mark:
### For CAS Proxy Web Flow
1. Open browser, go to http://127.0.0.1:15301 (**cas-web-client-proxy-auth**)
2. Click login, you will be redirect to CAS login page (**cas-server**) with the `pgtUrl` (proxy callback: **cas-proxy-app**) 
3. Login with follows account
    - Username: casuser
    - Password: Mellon
4. CAS server will make a GET request to the `pgtUrl` (proxy callback) with proxy grant data, the proxy application (**cas-proxy-app**) should record/handle the proxy grant data properly.
5. You will be redirect back to the http://127.0.0.1:15301 (**cas-web-client-proxy-auth**)
6. You're now logged in with CAS :heavy_check_mark:
7. **cas-web-client-proxy-auth** make call to **cas-proxy-app** with `pgtiou` to retrieve the `pt` (proxy ticket) for the target API application (**cas-api**)
8. **cas-proxy-app** should
    1. Cross-check the proxy data handled in *step4* with the `pgtiou`, 
    2. Make calls to CAS sever (**cas-server**) to create a proxy ticket for API application (**cas-api**)
    3. Return the `pt`
9. **cas-web-client-proxy-auth** make call to **cas-api** with `pt` (from *step 8*) to `login/register` to **cas-api** with the given `pt`
10. **cas-api** should
    - Validate the `pt` with CAS server (**cas-server**)
    - When the `pt` is valid, the api server should accept this `pt` for current user and other api requests make with this `pt` in future (or any custom auth logic)
    - Return a appropriate response.
11. You're now able to make call to the API server (**cas-api**) with the `pt` (or any custom auth logic) :heavy_check_mark:

# License

MIT license
