import * as net from 'net';

const client = net.createConnection({host: '5.39.79.61', port: 3001}, () => {
  console.log('Connected to the server.');
  client.write('CLIENT : "Hello this is one of your clients!"');
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('Server has stopped.');
});
