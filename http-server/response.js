const statusObj = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
  501: "Not Implemented",
  503: "Service Unavailable",
};

export const createResponse = (socket) => {
  let statusCode = 200;
  let headers = {};
  let sent = false;

  const response = {
    status: (code) => {
      statusCode = code;
      return response;
    },

    setHeader: (key, value) => {
      headers[key] = value;
      return response;
    },

    send: (body = "") => {
      if (sent) throw new Error("Response already sent");
      sent = true;

      if (typeof body !== "string") body = String(body);

      const finalHeaders = { ...headers };
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "text/plain";
      }

      const res = buildResponse(statusCode, finalHeaders, body);
      socket.write(res);
      socket.end();
    },

    json: (data) => {
      return response
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(data));
    },
  };
  return response;
};

const buildResponse = (statusCode, headers, body) => {
  if (!(statusCode >= 100 && statusCode <= 599)) statusCode = 500;

  const statusMsg = statusObj[statusCode] || "Internal Server Error";

  const headerString = Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}\r\n`)
    .join("");

  return (
    `HTTP/1.1 ${statusCode} ${statusMsg}\r\n` +
    `${headerString}` +
    `Content-Length: ${Buffer.byteLength(body)}\r\n` +
    `Connection: close\r\n` +
    `\r\n` +
    `${body}`
  );
};
