'use strict';
/* globals describe, it, before, beforeEach, afterEach */
import app from '../..';
import User from './user.model';
var user;
var genUser = function() {
  user = new User({
    provider: 'local',
    nome: 'User',
    sobrenome: 'User Faker',
    email: 'test@example.com',
    username: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.remove();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.remove();
  });

  it('Deve começar com nenhum usuário', function() {
    return User.find({}).exec().should
      .eventually.have.length(0);
  });

  it('Deve falhar ao salvar um usuário duplicado', function() {
    return user.save()
      .then(function() {
        var userDup = genUser();
        return userDup.save();
      }).should.be.rejected;
  });

  describe('#nome', function() {
    it('Deve falhar ao salvar com um nome em branco', function() {
      user.nome = '';
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar com um nome nulo', function() {
      user.nome = null;
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar sem um nome', function() {
      user.nome = undefined;
      return user.save().should.be.rejected;
    });
  });

  describe('#sobrenome', function() {
    it('Deve falhar ao salvar com sobrenome em branco', function() {
      user.nome = '';
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar com sobrenome nulo', function() {
      user.nome = null;
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar sem um sobrenome', function() {
      user.nome = undefined;
      return user.save().should.be.rejected;
    });
  });

  describe('#username', function() {
    it('Deve falhar ao salvar com username em branco', function() {
      user.username = '';
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar com username nulo', function() {
      user.username = null;
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar sem username', function() {
      user.username = undefined;
      return user.save().should.be.rejected;
    });
  });

  describe('#email', function() {
    it('Deve falhar ao salvar com email em branco', function() {
      user.email = '';
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar com email nulo', function() {
      user.email = null;
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar sem email', function() {
      user.email = undefined;
      return user.save().should.be.rejected;
    });
  });

  describe('#password', function() {
    it('Deve falhar ao salvar com senha em branco', function() {
      user.password = '';
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar com senha nulo', function() {
      user.password = null;
      return user.save().should.be.rejected;
    });

    it('Deve falhar ao salvar sem senha', function() {
      user.password = undefined;
      return user.save().should.be.rejected;
    });

    describe('Dado que o usuário foi salvo anteriormente', function() {
      beforeEach(function() {
        return user.save();
      });

      it('Deve autenticar usuário se válido', function() {
        user.authenticate('password').should.be.true;
      });

      it('Não deve autenticar usuário se inválido', function() {
        user.authenticate('blah').should.not.be.true;
      });

      it('Deve permanecer o mesmo hash a menos que a senha seja atualizada', function() {
        user.name = 'Test User';
        return user.save()
          .then(function(u) {
            return u.authenticate('password');
          }).should.eventually.be.true;
      });
    });
  });
});
