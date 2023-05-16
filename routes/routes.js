var express = require('express')
var usuarioController = require('../controllers/usuarioController')
var apresentacaoController = require('../controllers/apresentacaoController')
var candidatoController = require('../controllers/candidatoController')
var avaliacaoController = require('../controllers/avaliacaoController')
const passport = require("passport");
const {autenticado, admin} = require("../helpers/acesso")

var rotas = express.Router()

rotas.get("/", (req,res) => {
    res.redirect("login");
})
rotas.get("/login", usuarioController.mostrarFormLogin)

// Rota das páginas
rotas.get("/cadastrarApresentacao", autenticado, apresentacaoController.cadastroApresentacao);
rotas.get("/cadastrarUsuario", usuarioController.cadastroUsuario);
rotas.get("/apresentacao", autenticado, apresentacaoController.listaApresentacaoCandidato);
rotas.get("/editarApresentacao/:id", autenticado, apresentacaoController.editarApresentacaoCandidato);
rotas.post("/editar/:id", apresentacaoController.montarReqEdicao);
rotas.get("/deleteApresentacao/:id", autenticado, apresentacaoController.deleteApresentacaoCandidato);
rotas.get("/tableVotacao/:id", autenticado, avaliacaoController.listaVotacao);
rotas.post("/votar/:id", avaliacaoController.montarReqVotacao);

// Rotas de Usuário da API
rotas.post("/usuario", usuarioController.create);
rotas.get("/usuario/:id", usuarioController.findOne);
rotas.get("/usuario", autenticado, usuarioController.findAll);
rotas.put("/usuario/:id", usuarioController.update);
rotas.delete("/usuario/:id", usuarioController.destroy);

// //Rotas de Apresentação da API
rotas.get("/apresentacao/:id", autenticado, apresentacaoController.findOne);
rotas.post("/apresentacao", autenticado, apresentacaoController.cadastroCandidatoApresentacao);
rotas.put("/apresentacao/:id", apresentacaoController.update);
rotas.delete("/apresentacao/:id", apresentacaoController.destroy);

// Rotas de Candidato da API
rotas.post("/candidato", autenticado, candidatoController.create);
rotas.get("/candidato", autenticado, candidatoController.findAll);
rotas.put("/candidato/:id", autenticado, candidatoController.update);
rotas.delete("/candidato/:id", candidatoController.destroy);

//Rotas de Avaliação da API
rotas.get("/abrirVotacao", admin, avaliacaoController.abrirVotacao);
rotas.get("/fecharVotacao", admin, avaliacaoController.fecharVotacao);
rotas.get("/avaliacao", autenticado, avaliacaoController.findAll);
rotas.post("/avaliacao", autenticado, avaliacaoController.create);
rotas.get("/avaliacao/:id", autenticado, avaliacaoController.findOne);
rotas.put("/avaliacao/:id", avaliacaoController.update);
rotas.delete("/avaliacao/:id", avaliacaoController.destroy);

rotas.post("/logar", (req,res,next) => {
    passport.authenticate("local", {
        successRedirect: "/apresentacao",
        failureRedirect: "login"
    })(req,res,next)
})

rotas.get("/logout", (req,res) => {
    req.logout(req.user, erro => {
        if(erro) return next(erro);
        res.redirect("login");
    })
})

module.exports = rotas