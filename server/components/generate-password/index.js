'use strict';
/* https://github.com/bermi/password-generator */
let generatePassword = require('password-generator');

let config = {};
const UPPERCASE_RE = /([A-Z])/g;
const LOWERCASE_RE = /([a-z])/g;
const NUMBER_RE = /([\d])/g;
const SPECIAL_CHAR_RE = /([\?\-])/g;
//Nao deve conter sequencias de dois ou mais caracteres repetidos
const NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
  let uc = password.match(UPPERCASE_RE);
  let lc = password.match(LOWERCASE_RE);
  let n = password.match(NUMBER_RE);
  let sc = password.match(SPECIAL_CHAR_RE);
  let nr = password.match(NON_REPEATING_CHAR_RE);
  return password.length >= config.minLength
    && !nr && uc && uc.length >= config.uppercaseMinCount
    && lc && lc.length >= config.lowercaseMinCount
    && n && n.length >= config.numberMinCount
    && sc && sc.length >= config.specialMinCount;
}
function generatePass(maxLength = 18, minLength = 12,
  uppercaseMinCount = 3, //Deve conter pelo menos tres letras maiusculas
  lowercaseMinCount = 3, //Deve conter pelo menos tres letras minusculas
  numberMinCount = 2,  //Deve conter pelo menos dois números
  specialMinCount = 2 //Deve conter pelo menos dois caracteres especiais
  ) {
  config = {
    maxLength,
    minLength,
    uppercaseMinCount,
    lowercaseMinCount,
    numberMinCount,
    specialMinCount
  };
  var password = '';
  var randomLength = Math.floor(Math.random() * (config.maxLength - config.minLength)) + config.minLength;
  while(!isStrongEnough(password)) {
    password = generatePassword(randomLength, false, /[\w\d\?\-]/);
  }
  return password;
}

module.exports = {
  generatePassword,
  generatePass,
};
