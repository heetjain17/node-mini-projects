import { server } from "./server.js";
import { reqParser } from "./request.js";
import { routeMatch } from "./router.js";
import { createResponse } from "./response.js";
import { loggerA, loggerB } from "./middleware.js";

server.listen(8000, () => {
  console.log("TCP Server running on port 8000");
});

const use = (fn) => {
  middlewares.push(fn);
};

const middlewares = [];
use(loggerA);
use(loggerB);

export const handle = (rawData, socket) => {
  const res = createResponse(socket);
  const parsedReq = reqParser(rawData);

  const result = routeMatch(parsedReq);

  if (result.status === 200) {
    let mwIdx = 0;
    const stack = [...middlewares, ...result.middleware, result.handler];
    const next = () => {
      if (res.sent() === true) {
        console.error("next() called after response was sent");
        return;
      }

      const fn = stack[mwIdx++];
      if (!fn) return;

      fn(parsedReq, res, next);
    };
    next();
  }

  if (result.status == 405) {
    res
      .status(405)
      .setHeader("Allow", result.allowedMethods.join(", "))
      .send("Method Not Allowed");
  }

  if (result.status === 404) {
    res.status(404).send("Not Found");
  }
};
