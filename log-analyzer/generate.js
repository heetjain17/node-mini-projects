import fs from "fs";

const methods = ["GET", "POST", "PUT", "DELETE"];
const endpoints = [
  "/api/users",
  "/api/products",
  "/api/orders",
  "/login",
  "/checkout",
  "/dashboard",
  "/search",
  "/products",
];

const statusCodes = [200, 200, 200, 200, 201, 404, 401, 500];

const startTime = new Date("2026-03-10T10:30:00Z");

const output = fs.createWriteStream("massive_access.log");

const totalLines = 10_000_000;
let i = totalLines;

console.log(`Generating ${totalLines} logs...`);

function randomIP() {
  return `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`;
}

function randomSize() {
  return Math.floor(Math.random() * 900) + 100;
}

function formatTimestamp(date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}:${h}:${m}:${s} +0000`;
}

function write() {
  let ok = true;

  while (i > 0 && ok) {
    i--;

    const ip = randomIP();
    const method = methods[Math.floor(Math.random() * methods.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const status = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    const size = randomSize();

    const timestamp = formatTimestamp(startTime);

    startTime.setSeconds(startTime.getSeconds() + 1);

    const line = `${ip} - - [${timestamp}] "${method} ${endpoint} HTTP/1.1" ${status} ${size}\n`;

    if (i === 0) {
      output.write(line, () => console.log("Finished!"));
    } else {
      ok = output.write(line);
    }

    if (i % 1_000_000 === 0) {
      console.log(`${i / 1_000_000}M lines remaining`);
    }
  }

  if (i > 0) {
    output.once("drain", write);
  }
}

write();
