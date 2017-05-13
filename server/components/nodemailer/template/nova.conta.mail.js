import TemplateMail from './template.mail';

export default class NovaContaMail extends TemplateMail {
  constructor(req, user) {
    super();
    this.from = 'pelommedrado@gmail.com';
    this.subject = 'Bem-vindo(a) ao myfisio';
    this.to = user.email;
    this.data = {
      title: 'Bem-vindo(a) ao myfisio',
      name: `${user.nome} ${user.sobrenome}`,
      message: 'Clique abaixo para fazer a verificação de sua conta.',
      action: `${req.headers.origin}/signupvalid?token=${user.activeToken}`,
      copymark: 'PJsin 2008-2017',
      username: user.username,
      urlLogin: `${req.headers.origin}/login`,
    };
  }
  getTemplate() {
    return this.pathResolve('./nova.conta.mail.html');
  }
}
