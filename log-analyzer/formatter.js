import fs from "fs/promises";

export const generateReport = async (stats) => {
  const content = generateContent(stats);
  try {
    await fs.writeFile("report.md", content, "utf-8");
  } catch (error) {
    console.error("Error generating report: ", error);
    process.exit(1);
  }
};

const generateContent = ({
  totalRequests,
  invalidLines,
  errorRequests,
  ipCounts,
  endpointCounts,
  methodCounts,
  statusCounts,
  reqPerMin,
}) => {
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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

  const reqPerMinSection = Object.entries(reqPerMin)
    .map(([timeStamp, count]) => `${timeStamp}: ${count}`)
    .join("\n");

  return `#LOG ANALYSIS REPORT
===================

## SUMMARY

- Total Requests : ${totalRequests}
- Invalid Lines  : ${invalidLines}
- Error Requests : ${errorRequests}

## TOP IP ADDRESSES

${ipSection}

## REQ PER MIN
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
