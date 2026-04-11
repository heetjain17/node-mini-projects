# RATELIMITER

1. middleware.js
   - supports chaining
   - supports early exit
2. rateLimiter.js
   - exports factory (config → middleware)
3. app.js
   applies:
   - global limiter
   - route-specific limiter

Contract:

- allow / reject (deterministic decision)
- TC: O(1)
- no side effects outside its scope
- safe under concurrent requests
- storage layer for storing state
- add headers

Algotihm Choice

- **Token Bucket**

State (per IP):

- tokens
- lastRefillTimestamp
