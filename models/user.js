const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" необходимо заполнить'],
    minlength: [2, 'Минимальная длина "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина "name" - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" необходимо заполнить'],
    minlength: [2, 'Минимальная длина "about" - 2 символа'],
    maxlength: [30, 'Максимальная длина "about" - 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: [true, 'Поле "avatar" необходимо заполнить'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
