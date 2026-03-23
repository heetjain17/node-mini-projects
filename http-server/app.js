import { server } from "./server.js";
import { reqParser } from "./request.js";
import { routeMatch } from "./router.js";
import { createResponse } from "./response.js";

server.listen(8000, () => {
  console.log("TCP Server running on port 8000");
});

export const handle = (rawData, socket) => {
  const res = createResponse(socket);
  const parsedReq = reqParser(rawData);

  const result = routeMatch(parsedReq);

  if (result.status === 200) {
    return result.handler(parsedReq, res);
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
