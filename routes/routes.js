var express = require('express')
var usuarioController = require('../controllers/usuarioController')
var apresentacaoController = require('../controllers/apresentacaoController')
var candidatoController = require('../controllers/candidatoController')
var avaliacaoController = require('../controllers/avaliacaoController')

var rotas = express.Router()

// Rotas de Usuário da API
rotas.post("/usuario", usuarioController.create);
rotas.get("/usuario/:id", usuarioController.findOne);
rotas.get("/usuario", usuarioController.findAll);
rotas.put("/usuario/:id", usuarioController.update);
rotas.delete("/usuario/:id", usuarioController.destroy);

// Rota das páginas
rotas.get("/cadastrarUsuario", usuarioController.cadastroUsuario);

// //Rotas de Apresentação da API
rotas.post("/apresentacao", apresentacaoController.cadastroCandidatoApresentacao);
rotas.get("/apresentacao/:id", apresentacaoController.findOne);
rotas.get("/apresentacao", apresentacaoController.findAll);
rotas.put("/apresentacao/:id", apresentacaoController.update);
rotas.delete("/apresentacao/:id", apresentacaoController.destroy);

rotas.get("/cadastrarApresentacao", apresentacaoController.cadastroApresentacao);

// Rotas de Candidato da API
rotas.post("/candidato", candidatoController.create);
rotas.get("/candidato", candidatoController.findAll);
// rotas.put("/candidato/:id", candidatoController.update);
// rotas.delete("/candidato/:id", candidatoController.destroy);

// //Rotas de Avaliação da API
// rotas.post("/avaliacao", avaliacaoController.create);
// rotas.get("/avaliacao/:id", avaliacaoController.findOne);
// rotas.get("/avaliacao", avaliacaoController.findAll);
// rotas.put("/avaliacao/:id", avaliacaoController.update);
// rotas.delete("/avaliacao/:id", avaliacaoController.destroy);

module.exports = rotas

