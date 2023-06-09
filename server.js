const express = require("express");
const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");
const socketio = require("socket.io");
const { promisify } = require("util");

const readdirAsync = promisify(fs.readdir);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const STARTERS_PATH = path.join(__dirname, "Starters");
const COUNTERPICKS_PATH = path.join(__dirname, "Counterpicks");

// Ground truth for the state of stage bans
var stage_bans_dict = initStageBans();

// serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "img")));

// serve static files from Starters directory
app.use("/Starters", express.static(STARTERS_PATH));

// serve static files from Counterpicks directory
app.use("/Counterpicks", express.static(COUNTERPICKS_PATH));

// handle GET request to '/' route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// handle GET request to '/Starters' route
app.get("/Starters", async (req, res) => {
  try {
    const files = await readdirAsync(STARTERS_PATH);
    const images = files.filter((file) => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images
      .map((image) => `<img src="${path.join("Starters", image)}">`)
      .join("");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// handle GET request to '/Counterpicks' route
app.get("/Counterpicks", async (req, res) => {
  try {
    const files = await readdirAsync(COUNTERPICKS_PATH);
    const images = files.filter((file) => /\.(jpe?g|png|gif)$/i.test(file));
    const html = images
      .map((image) => `<img src="${path.join("Counterpicks", image)}">`)
      .join("");
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// get the IPv4 address of the computer
const interfaces = os.networkInterfaces();
let host = "localhost";
Object.keys(interfaces).forEach((name) => {
  const iface = interfaces[name];
  iface.forEach((addr) => {
    if (addr.family === "IPv4" && !addr.internal) {
      host = addr.address;
    }
  });
});

// broadcast strikeOutStage event to clients
function strikeOutStage() {
  io.emit("strikeOutStage");
}

io.on("connection", (socket) => {
  // Always send current state on connection
  socket.emit("init", stage_bans_dict);

  socket.on("update", (message) => {
    stage_bans_dict[message.stage] = message.is_banned;
    // Broadcast new state
    io.emit("update", stage_bans_dict);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});


// Start server
const port = process.env.PORT || 3000;
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});

function initStageBans() {
  let stage_bans_dict = {};
  populateStageIsBannedDict("Starters", stage_bans_dict);
  populateStageIsBannedDict("Counterpicks", stage_bans_dict);
  return stage_bans_dict;
}

// Set all stages from within folder_name as unbanned in stage_bans_dict
function populateStageIsBannedDict(folder_name, stage_bans_dict) {
  try {
    const files = fs.readdirSync(path.join(__dirname, folder_name));
    const image_filenames = files.filter((file) =>
      /\.(jpe?g|png|gif)$/i.test(file)
    );
    image_filenames.forEach(
      (element) => (stage_bans_dict[path.join(folder_name, element)] = false)
    );
  } catch (err) {
    console.error(
      "Failed to read " +
        path.join(__dirname, folder_name) +
        " folder: \n" +
        err
    );
  }
}
