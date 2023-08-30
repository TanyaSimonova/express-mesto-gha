//* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((e) => {
    console.log('DB not connected', e);
  });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// временное решение авторизации пользователя

app.use((req, res, next) => {
  req.user = {
    _id: '64ee291968bbbe7dc60f73b2',
  };
  next();
});

app.use(cardRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
