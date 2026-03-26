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

6. handler.js
   - helper functions

7. middleware.js
   - middleware functions

## CURRENT ACHIEVABLES

~~- TCP server running~~
~~- raw HTTP req logging~~
~~- req res handling~~
~~- routing~~
~~- JSON support in res~~
~~- 404 handling~~

## FUTURE IMPROVEMENTS

~~- **middlewares**~~
~~- improved res using statuscodes~~
~~- query params~~
~~- POST~~
~~- route params~~

## NEVER SEE ME AGAIN

1. System level
   - Streaming of output (send file in chunks)
     support res.write(), res.end()
   - Request body streaming
     handle large payloads and chunked requests
   - Keep alive connections
     on every req from same client the connection should be same

2. Middleware
   - Route groups like express
     example app.use('/api/v1', auth)
   - Middleware composition
     multiple middlewares behave like sigle unit
   - Req lifecycle tracking
     req.id, req.startTime

3. Prod lvl
   - Rate limiting
   - Caching layer
   - Compression

4. Convert to real framework
   - Plugin system
   - add configs
   - concurrency + backpressure
   - Observability: logs, stats, analytics
