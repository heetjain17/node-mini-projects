import { normalize } from "node:path";

export const reqParser = (rawReq, rawIp) => {
  const [headerPart, bodyPart] = rawReq.split("\r\n\r\n");
  const lines = headerPart.split("\r\n");
  const [method, completePath, version] = lines[0].split(" ");

  // store headers in key, value pairs
  let headers = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "") break;

    let idx = lines[i].indexOf(":");
    let key = lines[i].slice(0, idx);
    let value = lines[i].slice(idx + 1);

    key = key.trim().toLowerCase();
    value = value.trim();

    headers[key] = value;
  }

  // store the body in json if mentioned
  let body = bodyPart || null;
  if (body && headers["content-type"] == "application/json") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  // store query params in key, value pair
  const [path, queryString] = completePath.split("?");

  const query = {};

  if (queryString) {
    const pairs = queryString.split("&");

    for (let pair of pairs) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      if (!key) continue;
      query[key] = value;
    }
  }

  // formatting Ip
  const ip = normalizeIp(rawIp, headers);

  return {
    method: method,
    path: path,
    query: query,
    version: version,
    headers: headers,
    body: body,
    ip: ip,
  };
};

const normalizeIp = (rawIp, headers) => {
  let ip;
  if (headers["x-forwarded-for"]) {
    ip = headers["x-forwarded-for"].split(",")[0].trim();
  } else {
    ip = rawIp.trim();
  }

  // normalizing IPv4 which was mapped to IPv6
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  if (ip == "::1") {
    ip = "127.0.0.1";
  }

  return ip;
};
