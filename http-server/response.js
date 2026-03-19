export const createResponse = (socket) => {
  const send = (body) => {
    const res =
      `HTTP/1.1 200 OK\r\n` +
      `Content-type: text/plain\r\n` +
      `Content-length: ${Buffer.byteLength(body)}\r\n` +
      `Connection: close\r\n` +
      `\r\n` +
      `${body}`;

    socket.write(res);
    socket.end();
  };

  const json = (data) => {
    const body = JSON.stringify(data);
    const res =
      `HTTP/1.1 200 OK\r\n` +
      `Content-type: application/json\r\n` +
      `Content-length: ${Buffer.byteLength(body)}\r\n` +
      `Connection: close\r\n` +
      `\r\n` +
      `${body}`;
    socket.write(res);
    socket.end();
  };
  return { send, json };
};
