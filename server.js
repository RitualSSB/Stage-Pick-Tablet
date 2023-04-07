const express = require('express');
const php = require('node-php');
const path = require('path');
const fs = require('fs');

const app = express();

const StartersFolder = path.join(__dirname, 'Starters');
const CounterpicksFolder = path.join(__dirname, 'Counterpicks');
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
  res.sendFile(path.join(__dirname, 'img/Strike.png'));
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

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
