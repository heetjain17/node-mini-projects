import { aboutHandler, rootHandler, userHandler } from "./handlers.js";

const routes = [
  { method: "GET", path: "/", handler: rootHandler },
  { method: "GET", path: "/user", handler: userHandler },
  { method: "GET", path: "/about", handler: aboutHandler },
];

export const routeMatch = (parsedReq) => {
  for (let i = 0; i < routes.length; i++) {
    if (
      parsedReq.method === routes[i].method &&
      parsedReq.path === routes[i].path
    ) {
      return routes[i].handler;
    }
  }

  return null;
};
