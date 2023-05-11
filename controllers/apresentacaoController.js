const { raw } = require("express")
const usuario = require("../models/usuario")
var apresentacao = require("../models/apresentacao")
var candidato = require("./../models/candidato")

var apresentacaoControlador = {}

apresentacaoControlador.create = function(req, res){
    apresentacao.create({
        nome: req.body.nome
    }).then(
        function(dados) {
            res.status(200).json({ idApresentacao: dados.idApresentacao });
        }
    ).catch(
        function(erro) {
            res.status(500).send("Erro no cadastro da apresentação: "+erro)    
        }
    )
}

apresentacaoControlador.findOne = function(req, res){
    apresentacao.findOne({
        raw: true,
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar pela apresentação id ${req.params.id} informada: `+erro)
        }
    )
}
apresentacaoControlador.findAll = function(req, res){
    apresentacao.findAll({
        raw: true
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar as apresentações: `+erro)
        }
    )
}

apresentacaoControlador.update = function(req, res){
    apresentacao.update({
        nome: req.body.nome
    },{
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao atualizar a apresentação: `+erro)
        }
    )
}

apresentacaoControlador.destroy = function(req, res){
    apresentacao.destroy({
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao remover a apresentação: `+erro)
        }
    )
}

// ------------------------------------------------------------------------

apresentacaoControlador.cadastroApresentacao = function(req, res){
    usuario.findAll({
        raw: true
    }).then(
        function(dados){
            res.render("cadastroApresentacao", {nome: dados})
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar os usuários: `+erro)
        }
    )
}

apresentacaoControlador.cadastroCandidatoApresentacao = function(req, res) {
    apresentacao.create({
        nome: req.body.nome
    }).then(function(dados) {
        var idAp = dados.idApresentacao; // Armazena o ID da apresentação criada

        console.log(req.body.idUsuario)
        let usuarios = req.body.idUsuario.filter((user) => user != "");
        usuarios.forEach(element => {
            candidato.create({
                idApresentacao: idAp, // Atribui o ID da apresentação ao campo idApresentacao de cada usuário
                idUsuario: element
            }).then(function() {
                // Lógica após o cadastro do candidato
            }).catch(function(erro) {
                res.status(500).send("Erro no cadastro do Candidato: " + erro);
            });
        });
    }).catch(function(erro) {
        res.status(500).send("Erro no cadastro da apresentação: " + erro);
    });
    res.render("cadastroApresentacao")
};

module.exports = apresentacaoControlador