import { getUser, createUser, rootHandler, debugHandler } from "./handlers.js";

const routes = {
  "/": {
    GET: rootHandler,
  },
  "/user": {
    GET: getUser,
    POST: createUser,
  },
  "/debug": {
    GET: debugHandler,
  },
};

export const routeMatch = (parsedReq) => {
  const { method, path } = parsedReq;

  const route = routes[path];
  if (!route) return { status: 404 };

  const handler = route[method];
  if (!handler) {
    const allowedMethods = Object.keys(route);
    return { status: 405, allowedMethods };
  }

  return { status: 200, handler: handler };
};
