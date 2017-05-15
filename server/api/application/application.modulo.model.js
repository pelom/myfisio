'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';
var ApplicationModuloSchema = new Schema({
  nome: {
    type: String, required: true, minlength: 3, maxlength: 20, trim: true },
  state: { type: String, required: false },
  icon: { type: String, required: false },
  descricao: String,
  /*status: {
    type: String,
    enum: ['Ativo', 'Desativo'],
    required: true,
    default: 'Ativo'
  },*/
  isAtivo: {
    type: Boolean, required: true, default: true
  },
  funcoes: [String],
  serveEmail: {
    service: {type: String },
    user: {type: String },
    password: {type: String }
  },
  property: Schema.Types.Mixed,
  criador: { type: Schema.Types.ObjectId, ref: 'User' },
  modificador: { type: Schema.Types.ObjectId, ref: 'User' },
  application: { type: Schema.Types.ObjectId, ref: 'Application' }
}, {
  timestamps: true
});
export default mongoose.model('ApplicationModulo', ApplicationModuloSchema);
