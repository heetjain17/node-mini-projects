# HTTP SERVER

## FILE STRUCTURE

1. server.js (TCP layer)
   - starts server
   - listens on port
   - pass rawdata -> app

2. app.js (entrypoint)
   - store routes
   - accept incoming parsed request
   - call correct handler

3. router.js (routing engine)
   - handles and matches routes

4. request.js (req parser)
   - rawdata -> structured object

5. response.js (res builder)
   - sends proper http res which includes
     - status code,
     - headers,
     - body

6. utils.js
   - helper functions

## CURRENT ACHIEVABLES

~~- TCP server running~~
~~- raw HTTP req logging~~
~~- req res handling~~
~~- routing~~
~~- JSON support in res~~
~~- 404 handling~~

## FUTURE IMPROVEMENTS

- **middlewares**
  ~~- improved res using statuscodes~~
- query params
- POST
- route params
- error and logs handling
