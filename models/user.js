const mongoose = require('mongoose');
const validator = require('validator');
const REGEX_URL = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина "name" - 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина "about" - 2 символа'],
    maxlength: [30, 'Максимальная длина "about" - 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return REGEX_URL.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: {
      value: true,
      message: 'Поле email явялется обязательным',
    },
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле password явялется обязательным',
    },
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
