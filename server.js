const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/start-bot', (req, res) => {
  require('./discord');
  res.send('Bot is starting...');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});