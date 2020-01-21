const path = require('path');
const express = require('express');
const app = express();

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});