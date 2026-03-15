let totalRequests = 0,
  invalidLines = 0,
  errorRequests = 0;
let ipCounts = {},
  endpointCounts = {},
  methodCounts,
  statusCounts = {};
methodCounts = {
  GET: 0,
  POST: 0,
  PUT: 0,
  PATCH: 0,
  DELETE: 0,
};

export const analyzer = (log) => {
  if (log == null) {
    invalidLines++;
    return;
  }
  totalRequests += 1;

  if (!ipCounts[log["ip"]]) {
    ipCounts[log["ip"]] = 1;
  } else {
    ipCounts[log["ip"]] += 1;
  }

  if (!endpointCounts[log["endpoint"]]) {
    endpointCounts[log["endpoint"]] = 1;
  } else {
    endpointCounts[log["endpoint"]] += 1;
  }

  methodCounts[log["method"]] += 1;

  if (!statusCounts[log["status"]]) {
    statusCounts[log["status"]] = 1;
  } else {
    statusCounts[log["status"]] += 1;
  }

  if (log["status"] >= 400) errorRequests += 1;
};

export const getResults = () => ({
  totalRequests,
  invalidLines,
  errorRequests,
  ipCounts,
  endpointCounts,
  methodCounts,
  statusCounts,
});
