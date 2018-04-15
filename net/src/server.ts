import * as net from 'net';


// when a client connects, this function is called
const server = net.createServer((socket) => {
  console.log('A new client has just connected.');
  socket.on('data', (data) => console.log(data.toString()));
  socket.write('SERVER: "Hello!"');

  setTimeout(() => {
    socket.end('SERVER: "Bye bye"');
  }, 10000);
	
});


server.listen(3001, () => {
  console.log('Server is listening.');
})
