import * as net from "net";

const server = net.createServer((socket) => {
  socket
    .on('data', (data) => {
      console.log(data);
    })
    .on('end', () => {
      console.log('server has ended');
    });
});

server.listen(3001, () => {
  console.log('listening');
})
