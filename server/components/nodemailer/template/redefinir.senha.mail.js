import TemplateMail from './template.mail';

export default class RedefiniSenhaMail extends TemplateMail {
  constructor(req, user) {
    super();
    this.from = 'pelommedrado@gmail.com';
    this.subject = 'Redefinição de senha';
    this.to = user.email;
    this.data = {
      title: 'Solicitação de redefinição de senha',
      message: 'Recentimente houve uma solicitou de redefinição de senha para sua conta myfisio. Clique no botão abaixo para redefini-lá',
      action: `${req.headers.origin}/signupvalid?token=${user.activeToken}`,
      copymark: 'PJsin 2008-2017',
      message2: 'Caso você não tenha solicitado essa redefinição de senha, por favor ignore este e-mail ou entre em contato com o administrador. '
    };
  }
  getTemplate() {
    return this.pathResolve('./redefinir.senha.mail.html');
  }
}
