'use strict';
export const populationCriador = {
  path: 'criador',
  select: 'nome sobrenome _id',
};

export const populationModificador = {
  path: 'modificador',
  select: 'nome sobrenome _id',
};

export const populationProfile = {
  path: 'profileId',
  select: '_id nome role tempoSessao',
  match: { isAtivo: true }
};

export const populationProprietario = {
  path: 'proprietario',
  select: '_id nome sobrenome',
};
