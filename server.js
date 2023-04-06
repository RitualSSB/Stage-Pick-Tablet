const express = require('express');
const php = require('node-php');
const path = require('path');

const app = express();

// Load PHP
app.use('/starters.php', php.cgi('php82/php-cgi'));
app.use('/counterpicks.php', php.cgi('php82/php-cgi'));

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// handle GET request to '/' route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
