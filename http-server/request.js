export const reqParser = (rawReq) => {
  const [headerPart, bodyPart] = rawReq.split("\r\n\r\n");
  const lines = headerPart.split("\r\n");
  const [method, path, version] = lines[0].split(" ");

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

  let body = bodyPart || null;
  if (body && headers["content-type"] == "application/json") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  return {
    method: method,
    path: path,
    version: version,
    headers: headers,
    body: body,
  };
};
