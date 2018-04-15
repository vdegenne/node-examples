import * as net from "net";

const server = net.createServer((socket) => {
  console.log('server is ready');
  socket.write('hello from the server');
});

server.on('data', (data) => {
  console.log(data.toString());
});

server.on('end', () => {
  console.log('server has stopped');
});

server.listen(3001, () => {
  console.log('listening');
})
