export const createRateLimiter = (config = {}) => {
  const store = new Map();
  const {
    maxTokens = 10,
    refilRate = 1,
    keyGenerator = (req) => req.ip,
  } = config;

  // runs for every request checking whether it is allowed or not
  function processRequest(clientId, now) {
    // checks in store
    let state = store.get(clientId);

    if (!state) {
      state = {
        tokens: maxTokens,
        lastRefil: now,
        lastSeen: now,
      };
    }

    // refil logic
    const elapsed = now - state.lastRefil;
    state.tokens += elapsed * refilRate;
    if (state.tokens > maxTokens) state.tokens = maxTokens;

    state.lastRefil = now;
    state.lastSeen = now;

    let allowed = false;
    let retryAfter = 0;

    // check if enough tokens are present
    if (state.tokens >= 1) {
      state.tokens -= 1;
      allowed = true;
    } else {
      const needed = 1 - state.tokens;
      retryAfter = needed / refilRate;
    }

    store.set(clientId, state);
    return {
      allowed,
      remainingTokens: Math.floor(state.tokens),
      retryAfter,
    };
  }

  return function rateLimiter(req, res, next) {
    const clientId = keyGenerator(req);
    const now = Date.now();

    const result = processRequest(clientId, now);

    console.log("ratelimitier running: ", result);
    res.setHeader("X-RateLimit-Limit", maxTokens);
    res.setHeader("X-RateLimit-Remaining", result.remainingTokens);

    if (!result.allowed) {
      res
        .setHeader("Retry-After", Math.ceil(result.retryAfter))
        .status(429)
        .json({
          error: "Too Many Requests",
          message: "Rate limit exceeded",
          retryAfter: Math.ceil(result.retryAfter),
        });
      return;
    }

    next();
  };
};
