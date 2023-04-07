const express = require('express');
const php = require('node-php');
const path = require('path');

const app = express();

// Load PHP

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Starters')));
app.use(express.static(path.join(__dirname, 'Counterpicks')));
app.use(express.static(path.join(__dirname, 'img')));
// handle GET request to '/' route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
