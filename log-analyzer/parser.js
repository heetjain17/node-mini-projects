const ip = "(\\d+\\.\\d+\\.\\d+\\.\\d+)";
const timestamp = `\\[(.*?)\\]`;
const method = `(GET|POST|PUT|DELETE|PATCH)`;
const endpoint = `(\\/\\S+)`;
const httpVersion = `HTTP\\/\\d\\.\\d`;
const statusCode = `(\\d{3})`;
const size = `(\\d+)`;

const logRegex = new RegExp(
  `^${ip} - - ${timestamp} "${method} ${endpoint} ${httpVersion}" ${statusCode} ${size}`,
);

export const parseLogLine = (line) => {
  const parsedLog = line.match(logRegex);
  if (parsedLog == null) return null;
  return {
    ip: parsedLog[1],
    timestamp: parsedLog[2],
    method: parsedLog[3],
    endpoint: parsedLog[4],
    status: parsedLog[5],
    size: parsedLog[6],
  };
};
