const ip = {
  "192.168.1.10": 12,
  "192.168.1.12": 4,
  "192.168.1.16": 32,
  "192.168.1.19": 10,
  "192.168.1.13": 23,
};

const iparray = Object.entries(ip);
console.log(iparray.sort((a, b) => b[1] - a[1]));
