'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var PermissaoSchema = new Schema({
  application: {type: Schema.Types.ObjectId, ref: 'Application', required: true },
  modulo: {type: Schema.Types.ObjectId, ref: 'ApplicationModulo', required: true },
  funcoes: [{type: String, required: true }]
}, {
  timestamps: true
});

var ProfileSchema = new Schema({
  nome: { type: String, required: true },
  descricao: String,
  tempoSessao: {
    type: Number, required: true, default: 60 * 30
  },
  permissoes: [PermissaoSchema],
  role: { type: String, required: true, default: 'user' },
  isAtivo: { type: Boolean, required: true, default: true },
  criador: { type: Schema.Types.ObjectId, ref: 'User' },
  modificador: { type: Schema.Types.ObjectId, ref: 'User'},
  property: Schema.Types.Mixed,
}, {
  timestamps: true
});
export default mongoose.model('Profile', ProfileSchema);
