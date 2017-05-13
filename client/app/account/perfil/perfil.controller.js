'use strict';

export default class PerfilController {
  /*@ngInject*/
  constructor(UsuarioService, Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
    this.meProfile = {};
    UsuarioService.loadMeProfile().then(meProfile => {
      this.meProfile = meProfile;
      console.log(meProfile);
    });
    this.user = {
      nome: 'André',
      sobrenome: 'Leite',
      email: 'pelommedrado@gmail.com',
      telefone: '11 5555 6666',
      celular: '11 9 7988 5555',
      endereco: {
        rua: 'Rua Ângelo Dedivitis',
        cep: '04410-060',
        bairro: 'Americanópolis',
        cidade: 'São Paulo',
        estado: 'SP',
        complemento: 'Minha Casa',
        numero: '441'
      }
    };
  }
}
