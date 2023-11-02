const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');
const limiter = require('./middlewares/limiter');
const NotFound = require('./errors/NotFound');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const REGEX_URL = require('./utils/constants');

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

app.use(limiter);
app.use(helmet());

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_URL),
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
app.use('*', (req, res, next) => next(new NotFound('Page not found')));

app.use(errors());

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
