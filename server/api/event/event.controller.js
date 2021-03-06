'use strict';
import Event from './event.model';
import User from '../user/user.model';
import ApiService from '../api.service';
import EventPdf from '../../components/genarate-pdf/event.pdf';
import Profile from '../profile/profile.model'
let api = ApiService();
let handleError = api.handleError;
let respondWithResult = api.respondWithResult;
let handleEntityNotFound = api.handleEntityNotFound;
let handleValidationError = api.handleValidationError;

let PROFILE_ADMIN_ID;
function obterProfileDefault(where, select) {
  Profile.findOne({ nome: where }, select).exec()
    .then(profile => {
      if(!profile) {
        console.log('Profile Admin não encontrado!');
        return;
      }
      PROFILE_ADMIN_ID = profile._id;
      return profile._id;
    })
    .catch(err => {
      console.log('Ex:', err);
    });
}
obterProfileDefault('Administrador', '_id');

export function domain(req, res) {
  let leitos = [];
  for(let i = 1; i <= 20; i++) {
    leitos.push(`Leito ${i}`);
  }
  res.status(200).json({
    status: Event.schema.path('status').enumValues,
    prioridade: Event.schema.path('prioridade').enumValues,
    convenio: ['Interno', 'Externo'],
    procedimento: [
      { name: 'Avaliação Inicial', shade: 'Procedimento' },
      { name: 'Fisioterapia Motora - FM', shade: 'Procedimento' },
      { name: 'Fisioterapia Respiratória - FR', shade: 'Procedimento' },
      { name: 'IOT / PCR', shade: 'Procedimento' },
      { name: 'Transporte Tomo / RM', shade: 'Procedimento' },
      { name: 'Transporte Interno', shade: 'Procedimento' },
      { name: 'Discussão de Caso', shade: 'Procedimento' },
      { name: 'Deambulação com Auxílio', shade: 'Procedimento' },
      { name: 'Deambulação sem Auxílio', shade: 'Procedimento' },
      { name: 'Instalação de VMI', shade: 'Procedimento' },
      { name: 'Instalação de VMNI', shade: 'Procedimento' },
      { name: 'Troca de Fixação', shade: 'Procedimento' },
      { name: 'Troca de Filtro VMI', shade: 'Procedimento' },
      { name: 'Troca de Circuíto', shade: 'Procedimento' },
      { name: 'Alteração de parâmetros - VM', shade: 'Procedimento' },
      { name: 'Checagem de Exames', shade: 'Procedimento' },
      { name: 'Acompanhamento de PM', shade: 'Procedimento' },
      { name: 'Orientação Familiar', shade: 'Procedimento' },
      { name: 'Extubação Acidental', shade: 'Procedimento' },
      { name: 'Óbito', shade: 'Saida' },
      { name: 'Alta', shade: 'Saida' },
    ],
    leito: leitos,
    quantidade: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  });
}
const populationProfile = {
  path: 'profileId',
  select: '_id nome property'
};

export function calendar(req, res) {
  User.findById(req.user._id)
    .select('_id locale timezone laguage agenda profileId')
    .populate([populationProfile])
    .exec()
    .then(handleEntityNotFound(res))
    .then(user => {
      if(!user) {
        return;
      }
      if(!user.hasOwnProperty('agenda')) {
        user.agenda = createAgenda();
      }
      user.agenda.businessHours.forEach(item => {
        item._id = undefined;
      });
      let configCalendar = createAgendaConfig(user);
      res.status(200).json(configCalendar);
      return configCalendar;
    })
    .catch(handleError(res));
}

function createAgenda() {
  return {
    editable: false,
    selectable: false,
    eventLimit: false,
    slotDuration: '01:00:00',
    businessHours: []
  };
}

function createAgendaConfig(user) {
  return {
    header: user.profileId.property.header,
    locale: user.locale,
    lang: user.laguage,
    editable: user.agenda.editable,
    selectable: user.agenda.selectable,
    eventLimit: user.agenda.eventLimit,
    slotDuration: user.agenda.slotDuration,
    //selectConstraint: 'businessHours',
    //eventConstraint: 'businessHours',
    businessHours: user.agenda.businessHours,
    timezone: 'local', // user.timezone,
    ignoreTimezone: false,
    height: 500,
    selectHelper: true,
    nowIndicator: true,
    navLinks: true, // can click day/week names to navigate views
  };
}

const selectIndex = '_id title start end status prioridade allDay descricao isAtivo'
  + ' proprietario criador modificador createdAt updatedAt tarefas origin'
  + ' local leito quantidade convenio';

const populationOrigin = {
  path: 'origin',
  select: '_id title start status'
};

const populationTarefa = {
  path: 'tarefas',
  select: '_id title start end status',
  options: {
    sort: { start: -1 }
  }
};

export function indexPdfLeito(req, res) {
  let firstDay = new Date(req.query.start);
  let lastDay = new Date(req.query.end);
  Event.aggregate([{
    $match: {
      start: { $gte: firstDay, $lte: lastDay }
    }
  },
  {
    $group: {
      _id: '$leito',
      procedimentos: { $addToSet: {title: '$title', quant: '$quantidade' } },
      quant: { $sum: '$quantidade' },
      count: { $sum: 1 },
      itens: { $push: '$$ROOT' }
    }
  }, {
    $sort: {
      _id: 1
    }
  }], function(err, result) {
    if(err) {
      console.log(err);
    } else {
      let user = api.getUserRequest(req);
      EventPdf().generateEventLeito(firstDay, lastDay, user, result, res);
    }
  });
}
export function indexPdf(req, res) {
  let firstDay = new Date(req.query.start);
  let lastDay = new Date(req.query.end);
  //let status = req.query.status || 'Concluído'.split(',');
  console.log(firstDay, lastDay);

  Event.aggregate([{
    $match: {
      start: { $gte: firstDay, $lte: lastDay }
    }
  }, {
    $group: {
      _id: '$title',
      sum: { $sum: '$quantidade' },
      count: { $sum: 1 },
      itens: { $push: '$$ROOT' }
    }
  }, {
    $sort: {
      _id: 1
    }
  }], function(err, result) {
    if(err) {
      console.log(err);
    } else {
      let user = api.getUserRequest(req);
      EventPdf().generateEventProcedimento(firstDay, lastDay, user, result, res);
      /*User.populate(result, {
        path: 'users.user',
        select: '_id nome'
      }, function(err, results) {
        if(err) throw err;
        let user = api.getUserRequest(req);
        EventPdf().generateEventProcedimento(firstDay, lastDay, user, results, res);
      });*/
    }
  });

  /*Event.find({
    start: { $gte: firstDay, $lte: lastDay },
    //proprietario: req.user._id,
    //status: { $in: status }
  }, selectShow, {
    skip: 0, limit: 200,
    sort: {
      start: 1
    }
  })
    .populate([api.populationProprietario, api.populationCriador, api.populationModificador])
    .exec()
    .then(events => {
      events.forEach(item => {
        console.log(item.title, item.quantidade);
      });
      let user = api.getUserRequest(req);
      EventPdf().generateEventProcedimento(firstDay, lastDay, user, events, res);
    })
    .catch(handleError(res));
    */
}

export function index(req, res) {
  let firstDay = new Date(req.query.start);
  let lastDay = new Date(req.query.end);
  let status = req.query.status || 'Pendente,Em Andamento,Concluído,Cancelado'.split(',');
  console.log('firstDay', firstDay);
  console.log('lastDay', lastDay);
  console.log('User: ', req.user);
  console.log('PROFILE_ADMIN_ID', PROFILE_ADMIN_ID);

  let query = {
    model: 'Event',
    select: selectIndex,
    populate: [populationTarefa, populationOrigin, api.populationProprietario,
      api.populationCriador, api.populationModificador],
    where: {
      start: { $gte: firstDay, $lte: lastDay },
      //proprietario: req.user._id,
      status: { $in: status }
    },
    options: { skip: 0, limit: 50,
      sort: {
        createdAt: -1
      }
    }
  };

  if(req.user.profileId != PROFILE_ADMIN_ID) {
    query.where.proprietario = req.user._id;
  }
  return api.find(query, res);
}

const selectShow = '_id title start end status prioridade allDay descricao isAtivo'
  + ' proprietario criador modificador createdAt updatedAt tarefas origin local quantidade';

export function show(req, res) {
  return Event.find({_id: req.params.id, proprietario: req.user._id}, selectShow, {
    limit: 1
  })
    .populate([populationTarefa, populationOrigin, api.populationProprietario,
      api.populationCriador, api.populationModificador])
    .exec()
    .then(events => {
      if(events.length == 0) {
        handleEntityNotFound(res)();
      }
      return respondWithResult(res)(events[0]);
    })
    .catch(handleError(res));
}

export function create(req, res) {
  let eventJson = requestCreateEvent(req);
  var newApp = new Event(eventJson);
  newApp.save()
    .then(function(event) {
      if(event.origin) {
        Event.findByIdAndUpdate(event.origin,
          { $push: { tarefas: { $each: [event._id], $sort: { start: 1 } } }},
          { safe: true }, function(err, /*model*/) {
            console.log(err);
          }
        );
      }
      res.status(201).json(event);
      return event;
    })
    .catch(handleValidationError(res));
}

function requestCreateEvent(req) {
  return {
    start: req.body.start,
    end: req.body.end,
    allDay: req.body.allDay,
    status: req.body.status,
    prioridade: req.body.prioridade,
    local: req.body.local,
    title: req.body.title,
    descricao: req.body.descricao,
    origin: req.body.origin,
    proprietario: req.user._id,
    criador: req.user._id,
    modificador: req.user._id,
    leito: req.body.leito,
    quantidade: req.body.quantidade,
    convenio: req.body.convenio,
  };
}

export function update(req, res) {
  let eventJson = requestUpdateEvent(req);
  Event.findByIdAndUpdate(req.params.id, eventJson)
    .then(handleEntityNotFound(res))
    .then(event => {
      req.params.id = event._id;
      return show(req, res);
    })
    .catch(handleError(res));
}

function requestUpdateEvent(req) {
  return {
    _id: req.body._id,
    start: req.body.start,
    end: req.body.end,
    allDay: req.body.allDay,
    status: req.body.status,
    prioridade: req.body.prioridade,
    local: req.body.local,
    title: req.body.title,
    descricao: req.body.descricao,
    isAtivo: req.body.isAtivo,
    proprietario: req.user._id,
    modificador: req.user._id,
    leito: req.body.leito,
    quantidade: req.body.quantidade,
    convenio: req.body.convenio,
  };
}
