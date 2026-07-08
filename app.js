import express from 'express';

const app = express();

app.use(function (req, res, next) {
    console.log(`User requested: ${req.method} to ${req.url}`);
    next();
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.post('/', (req, res) => {
  res.send('<h1>farty</h1>');
});
