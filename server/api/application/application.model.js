'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var ApplicationSchema = new Schema({
  nome: {
    type: String, required: true, minlength: 3, maxlength: 30, trim: true, unique: true },
  descricao: String,
  modulos: [{ type: Schema.Types.ObjectId, ref: 'ApplicationModulo' }],
  isAtivo: { type: Boolean, required: true, default: true },
  criador: { type: Schema.Types.ObjectId, ref: 'User' },
  modificador: { type: Schema.Types.ObjectId, ref: 'User'}
}, {
  timestamps: true
});
export default mongoose.model('Application', ApplicationSchema);
