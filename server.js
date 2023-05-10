const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const socketio = require('socket.io');
const { promisify } = require('util');

const readdirAsync = promisify(fs.readdir);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const STARTERS_PATH = path.join(__dirname, 'Starters');
const COUNTERPICKS_PATH = path.join(__dirname, 'Counterpicks');

var stage_is_banned_dict = initStageBans();

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));

// serve static files from Starters directory
app.use('/Starters', express.static(STARTERS_PATH));

// serve static files from Counterpicks directory
app.use('/Counterpicks', express.static(COUNTERPICKS_PATH));

// handle GET request to '/' route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// handle GET request to '/Starters' route
app.get('/Starters', async (req, res) => {
  try {
    const files = await readdirAsync(StartersFolder);
    const images = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images.map(image => `<img src="/Starters/${image}">`).join('');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// handle GET request to '/Counterpicks' route
app.get('/Counterpicks', async (req, res) => {
  try {
    const files = await readdirAsync(CounterpicksFolder);
    const images = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images.map(image => `<img src="/Counterpicks/${image}">`).join('');
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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

// broadcast strikeOutStage event to clients
function strikeOutStage() {
  io.emit('strikeOutStage');
}

// listen for click and touchstart events
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  console.log(stage_is_banned_dict);

  socket.on('click', () => {
    console.log(`Socket ${socket.id} clicked.`);
    strikeOutStage();
  });

  socket.on('touchstart', () => {
    console.log(`Socket ${socket.id} touched.`);
    strikeOutStage();
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

// start server
const port = process.env.PORT || 3000;
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});

function initStageBans() {
  let stage_is_banned_dict = {}
  populateStageIsBannedDict('Starters', stage_is_banned_dict);
  populateStageIsBannedDict('Counterpicks', stage_is_banned_dict);
  return stage_is_banned_dict;
}

// Append unbanned stages from folder_name into an existing stage_is_banned_dict
function populateStageIsBannedDict(folder_name, stage_is_banned_dict) {
  console.log(path.join(__dirname, folder_name));

  try {
    const files = fs.readdirSync(path.join(__dirname, folder_name));
    const image_filenames = files.filter(file => /\.(jpe?g|png|gif)$/i.test(file));
    image_filenames.forEach(element => stage_is_banned_dict[path.join(folder_name, element)] = false);
  } catch (err) {
    console.error("Failed to read " + folder_name + " folder: \n" + err);
  }
}