const express = require('express');
const php = require('node-php');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const StartersFolder = path.join(__dirname, 'Starters');
const CounterpicksFolder = path.join(__dirname, 'Counterpicks');
let strike = '';

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));

// serve static files from Starters directory
app.use('/Starters', express.static(path.join(__dirname, 'Starters')));

// serve static files from Counterpicks directory
app.use('/Counterpicks', express.static(path.join(__dirname, 'Counterpicks')));

// handle GET request to '/' route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// handle GET request to '/Starters' route
app.get('/Starters', (req, res) => {
  const directoryPath = path.join(__dirname, 'Starters');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const images = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images.map(image => `<img src="/Starters/${image}">`).join('');
    res.send(html);
  });
});

// handle GET request to '/Counterpicks' route
app.get('/Counterpicks', (req, res) => {
  const directoryPath = path.join(__dirname, 'Counterpicks');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const images = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images.map(image => `<img src="/Counterpicks/${image}">`).join('');
    res.send(html);
  });
});

// handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // send current strike to new client
  socket.emit('strike', strike);

  // handle strike event from clients
  socket.on('strike', (newStrike) => {
    strike = newStrike;
    console.log(`Strike set to ${strike}`);
    io.emit('strike', strike); // send strike to all connected clients
  });

  // handle 'click' event
  socket.on('click', (data) => {
    console.log(`Received click event from ${socket.id}: ${data}`);
    
    // broadcast click event to all connected clients
    io.emit('click', data);
      socket.on('click', (data) => {
    console.log(`Received click event from ${socket.id}: ${data}`);
    
    // broadcast click event to all connected clients
    io.emit('click', data);
  });
});
  socket.on('touchstart', (data) => {
    console.log(`Received touchstart event from ${socket.id}: ${data}`);
    
    // broadcast touchstart event to all connected clients
    io.emit('touchstart', data);
    socket.on('touchstart', (data) => {
      console.log(`Received touchstart event from ${socket.id}: ${data}`);
  });
});
  // handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// get the IPv4 address of the computer
const interfaces = os.networkInterfaces();
let host = 'localhost';
Object.keys(interfaces).forEach((name) => {
  const iface = interfaces[name];
  iface.forEach((addr) => {
    if (addr.family === 'IPv4' && !addr.internal) {
      host = addr.address;
    }
  });
});

// start server
const port = process.env.PORT || 3000;
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});

