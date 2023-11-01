const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

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

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?#?/),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.use(auth);
app.use(cardRouter);
app.use(userRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Page not found' });
});
app.use(errors());

app.use(helmet());

app.use((err, req, res, next) => {
  next();
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Server error'
        : message,
    });
});

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
