import { server } from "./server.js";
import { reqParser } from "./request.js";
import { routeMatch } from "./router.js";
import { createResponse } from "./response.js";
import { errorHandler, loggerA, loggerB } from "./middleware.js";

server.listen(8000, () => {
  console.log("TCP Server running on port 8000");
});

const use = (fn) => {
  middlewares.push(fn);
};

// stores global middlewares in order
const middlewares = [];
use(loggerA);
use(loggerB);
use(errorHandler);

export const handle = (rawData, socket) => {
  const res = createResponse(socket);
  const parsedReq = reqParser(rawData);
  const result = routeMatch(parsedReq);

  // if route exists
  if (result.status === 200) {
    let mwIdx = 0;

    // stack for executing middlewares for each route in order
    const stack = [
      ...middlewares,
      ...result.middleware,
      result.handler,
      errorHandler,
    ];

    let error = null;

    const next = (err) => {
      if (res.sent() === true) {
        console.error("next() called after response was sent");
        return;
      }

      if (err) error = err;

      const fn = stack[mwIdx++];

      // fallback if global errorHandler doesnt executes
      if (!fn) {
        if (error && !res.sent()) {
          console.log("Fallback Middleware Hit");
          return res.status(500).json({
            error: error.message || "Internal Server Error",
          });
        }
        return;
      }

      // logic for executing error middleware
      const isErrorMw = fn.length === 4;
      try {
        if (error) {
          if (!isErrorMw) return next(error);
          fn(error, parsedReq, res, next);
        } else {
          if (isErrorMw) return next();
          fn(parsedReq, res, next);
        }
      } catch (e) {
        next(e);
      }
    };
    next();
  }

  // if route method not allowed
  if (result.status == 405) {
    res
      .status(405)
      .setHeader("Allow", result.allowedMethods.join(", "))
      .send("Method Not Allowed");
  }

  // if route DNE
  if (result.status === 404) {
    res.status(404).send("Not Found");
  }
};
