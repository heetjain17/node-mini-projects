import fs from "fs/promises";

export const generateReport = async (stats, options) => {
  let content;
  if (options.format === "json") {
    content = generateContentJson(stats, options);
  } else if (options.format === "csv") {
    content = generateContentCsv(stats, options);
  } else {
    content = generateContentMd(stats, options);
  }

  const filename = getFilename(options);
  try {
    await fs.writeFile(filename, content, "utf-8");
  } catch (error) {
    console.error("Error generating report: ", error);
    process.exit(1);
  }
};

const getFilename = (options) => {
  if (!options.output) {
    return `report.${options.format}`;
  }
  if (options.output.includes(".")) {
    return options.output;
  }

  return `${options.output}.${options.format}`;
};
const generateContentMd = (
  {
    totalRequests,
    invalidLines,
    errorRequests,
    ipCounts,
    endpointCounts,
    methodCounts,
    statusCounts,
    reqPerMin,
  },
  options,
) => {
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.topIp);

  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const ipSection = topIps
    .map(([ip, count], i) => `${i + 1}. ${ip} (${count} requests)`)
    .join("\n");

  const endpointSection = topEndpoints
    .map(([endpoint, count], i) => `${i + 1}. ${endpoint} (${count} requests)`)
    .join("\n");

  const methodSection = Object.entries(methodCounts)
    .map(([method, count]) => `${method}: ${count}`)
    .join("\n");

  const statusSection = Object.entries(statusCounts)
    .map(([status, count]) => `${status}: ${count}`)
    .join("\n");

  const generatedTime = new Date().toLocaleString("en-IN");

  const reqList = Object.entries(reqPerMin)
    .map(([timeStamp, count]) => `${timeStamp}: ${count}`)
    .join("\n");

  const reqPerMinSection = options.reqPerMin
    ? `
  
## REQ PER MIN

${reqList}

  `
    : ``;

  return `#LOG ANALYSIS REPORT
===================

## SUMMARY

- Total Requests : ${totalRequests}
- Invalid Lines  : ${invalidLines}
- Error Requests : ${errorRequests}

## TOP IP ADDRESSES

${ipSection}
${reqPerMinSection}
## MOST REQUESTED ENDPOINTS

${endpointSection}

## HTTP METHODS

${methodSection}

## STATUS CODES

${statusSection}

Generated at: ${generatedTime}
`;
};

const generateContentJson = (
  {
    totalRequests,
    invalidLines,
    errorRequests,
    ipCounts,
    endpointCounts,
    methodCounts,
    statusCounts,
    reqPerMin,
  },
  options,
) => {
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.topIp);

  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const result = {
    summary: {
      totalRequests,
      invalidLines,
      errorRequests,
    },

    topIps: topIps.map(([ip, count]) => ({ ip, count })),

    topEndpoints: topEndpoints.map(([endpoint, count]) => ({
      endpoint,
      count,
    })),

    methods: methodCounts,
    statusCodes: statusCounts,

    generatedAt: new Date().toLocaleString("en-IN"),
  };

  if (options.reqPerMin) {
    result.reqPerMin = reqPerMin;
  }

  return JSON.stringify(result, null, 2);
};

const generateContentCsv = (
  {
    totalRequests,
    invalidLines,
    errorRequests,
    ipCounts,
    endpointCounts,
    methodCounts,
    statusCounts,
    reqPerMin,
  },
  options,
) => {
  const lines = [];

  // SUMMARY
  lines.push("SECTION,SUMMARY");
  lines.push(`totalRequests,${totalRequests}`);
  lines.push(`invalidLines,${invalidLines}`);
  lines.push(`errorRequests,${errorRequests}`);
  lines.push("");

  // TOP IPS
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.topIp);

  lines.push("SECTION,TOP_IPS");
  lines.push("ip,count");
  topIps.forEach(([ip, count]) => {
    lines.push(`${ip},${count}`);
  });
  lines.push("");

  // ENDPOINTS
  const topEndpoints = Object.entries(endpointCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  lines.push("SECTION,TOP_ENDPOINTS");
  lines.push("endpoint,count");
  topEndpoints.forEach(([endpoint, count]) => {
    lines.push(`${endpoint},${count}`);
  });
  lines.push("");

  // METHODS
  lines.push("SECTION,METHODS");
  lines.push("method,count");
  Object.entries(methodCounts).forEach(([method, count]) => {
    lines.push(`${method},${count}`);
  });
  lines.push("");

  // STATUS
  lines.push("SECTION,STATUS_CODES");
  lines.push("status,count");
  Object.entries(statusCounts).forEach(([status, count]) => {
    lines.push(`${status},${count}`);
  });
  lines.push("");

  // REQ PER MIN (optional)
  if (options.reqPerMin) {
    lines.push("SECTION,REQ_PER_MIN");
    lines.push("timestamp,count");
    Object.entries(reqPerMin).forEach(([time, count]) => {
      lines.push(`${time},${count}`);
    });
    lines.push("");
  }

  lines.push(`generatedAt,${new Date().toLocaleString("en-IN")}`);

  return lines.join("\n");
};
