import {
  getProjectById,
  getUser,
  createUser,
  rootHandler,
  debugHandler,
} from "./handlers.js";

const routes = [
  { path: "/", method: "GET", handler: rootHandler },
  { path: "/user", method: "GET", handler: getUser },
  { path: "/user", method: "POST", handler: createUser },
  { path: "/project/:id", method: "GET", handler: getProjectById },
  { path: "/debug", method: "GET", handler: debugHandler },
];

export const routeMatch = (req) => {
  const { method, path } = req;

  let pathMatched = false;
  const allowedMethods = [];

  for (const route of routes) {
    const params = matchParams(route.path, path);
    if (!params) continue;

    pathMatched = true;
    allowedMethods.push(route.method);

    if (route.method === method) {
      req.params = params;
      return { status: 200, handler: route.handler };
    }
  }

  if (pathMatched) {
    return { status: 405, allowedMethods };
  }

  return { status: 404 };
};

const matchParams = (routePath, reqPath) => {
  const routeParts = normalize(routePath).split("/");
  const reqParts = normalize(reqPath).split("/");

  if (routeParts.length !== reqParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routeSeg = routeParts[i];
    const reqSeg = reqParts[i];

    if (routeSeg.startsWith(":")) {
      const key = routeSeg.slice(1);
      params[key] = reqSeg;
    } else {
      if (routeSeg !== reqSeg) return null;
    }
  }

  return params;
};

const normalize = (path) => {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
};
