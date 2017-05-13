/*eslint no-invalid-this:0*/
/*eslint no-sync:0*/
/*eslint prefer-rest-params:0*/
'use strict';
import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var AgendaSchema = new Schema({
  editable: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  eventLimit: { type: Boolean, default: false },
  startEditable: { type: Boolean, default: false },
  slotDuration: { type: String, enum: [
    '00:15:00', '00:30:00', '01:00:00', '01:30:00'], default: '00:30:00'},
  selectConstraint: String,
  eventConstraint: String,
  businessHours: [{
    dow: { type: Array, default: [1, 2, 3, 4, 5] },
    start: { type: String, default: '08:00'},
    end: { type: String, default: '18:00'}
  }],
});

var UserLoginSchema = new Schema({
  sessionid: String,
  userAgent: String,
  ip: String,
  data: { type: Date, default: Date.now,
		required: 'Must have data date - default value is the created date'
	},
  browser: { name: String, version: String },
  os: { name: String, version: String },
  device: { model: String, type_: String, vendor: String },
});
var EnderecoSchema = new Schema({
  address: String,
  zipcode: String,
  suburb: String,
  city: String,
  state: String,
  complement: String,
  country: String,
  number: String
});
var UserSchema = new Schema({
  nome: {
    type: String, required: true, minlength: 3, maxlength: 20, trim: true },
  sobrenome: {
    type: String, required: true, minlength: 3, maxlength: 40, trim: true },
  celular: {
    type: String, required: false, maxlength: 20 },
  telefone: {
    type: String, required: false, maxlength: 20 },
  empresa: {
    type: String, required: false, maxlength: 40 },
  email: {
    type: String, required: true, maxlength: 60, lowercase: true, trim: true },
  isAtivo: {
    type: Boolean, required: true, default: false },
  username: {
    type: String, required: true, maxlength: 60, lowercase: true, trim: true },
  password: {
    type: String, required: true
  },
  locale: { type: String, enum: ['pt-br', 'en'], default: 'pt-br' },
  laguage: { type: String, enum: ['pt_br'], default: 'pt_br' },
  timezone: { type: String, enum: ['America/Sao_Paulo'], default: 'America/Sao_Paulo' },
  agenda: AgendaSchema,
  resetPassword: {
    type: Boolean, default: undefined },
  salt: String,
  provider: String,
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
  endereco: EnderecoSchema,
  login: [UserLoginSchema],
  criador: { type: Schema.Types.ObjectId, ref: 'User' },
  modificador: { type: Schema.Types.ObjectId, ref: 'User'}
}, {
  timestamps: true
});

/**
 * Virtuals
 */

// Public profile information
UserSchema.virtual('profile').get(function() {
  return {
    name: this.nome + this.sobrenome,
    role: this.role
  };
});

// Non-sensitive info we'll be putting in the token
UserSchema.virtual('token').get(function() {
  return {
    _id: this._id,
    role: this.role
  };
});

/**
 * Validations
 */

UserSchema.path('email').validate(function(email) {
  var emailRegex = /^(([^<>()\[\]\.,;:\s@\\"]+(\.[^<>()\[\]\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\.,;:\s@\\"]+\.)+[^<>()[\]\.,;:\s@\\"]{2,})$/i;
  return emailRegex.test(email);
}, 'Email formaro inválido');

UserSchema.path('username').validate(function(value) {
  return new Promise(validateUsername(value, this._id));
}, 'O nome de usuário especificado já está em uso');

function validateUsername(value, id) {
  return function(resolve, reject) {
    let User = mongoose.model('User', UserSchema);
    return User.findOne({
      username: value
    }).exec()
    .then(user => {
      if(user) {
        if(id.equals(user._id)) {
          return resolve(true);
        }
        return reject();
      }
      return resolve(true);
    })
    .catch(err => {
      reject(err);
    });
  };
}
var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  // Handle new/update passwords
  if(!this.isModified('password')) {
    return next();
  }
  if(!validatePresenceOf(this.password)) {
    return next(new Error('Invalid password'));
  }

  // Make salt with a callback
  this.makeSalt((saltErr, salt) => {
    if(saltErr) {
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if(encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      return next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if(!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if(err) {
        return callback(err);
      }

      if(this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if(typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if(typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if(!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if(err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if(!password || !this.salt) {
      if(!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');
    var disg = 'sha1';

    if(!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, disg)
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, disg, (err, key) => {
      if(err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};
export default mongoose.model('User', UserSchema);
