export const reqParser = (rawReq) => {
  const req = rawReq.split("\r\n");

  const [method, path, version] = req[0].split(" ");

  let headers = {};
  for (let i = 1; i < req.length; i++) {
    if (req[i] === "") break;

    let idx = req[i].indexOf(":");
    let key = req[i].slice(0, idx);
    let value = req[i].slice(idx + 1);

    key = key.trim().toLowerCase();
    value = value.trim();

    headers[key] = value;
  }

  return {
    method: method,
    path: path,
    version: version,
    headers: headers,
    body: null,
  };
};
