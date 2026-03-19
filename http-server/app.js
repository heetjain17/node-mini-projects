import { server } from "./server.js";
import { reqParser } from "./request.js";
import { routeMatch } from "./router.js";
import { createResponse } from "./response.js";

server.listen(8000, () => {
  console.log("TCP Server running on port 8000");
});

export const handle = (rawData, socket) => {
  const parsedReq = reqParser(rawData);
  const handler = routeMatch(parsedReq);
  const res = createResponse(socket);

  if (handler) handler(parsedReq, res);
  else {
    res.send("404 Not Found");
  }
};
