var avaliacao = require("../models/avaliacao")
const usuario = require("../models/usuario")
const apresentacaoControlador = require("./apresentacaoController")
const usuarioControlador = require("./usuarioController")
var axios = require("axios")
const qs = require("querystring")

var avaliacaoControlador = {}

avaliacaoControlador.create = function(req, res){
    avaliacao.create({
        nota: req.body.nota,
        idCandidato: req.body.idCandidato
    }).then(
        function(dados) {
            res.status(200).send(`Avaliação cadastrada com sucesso!`)
        }
    ).catch(
        function(erro) {
            res.status(500).send("Erro no cadastro da avaliação: "+erro)
        }
    )
}

avaliacaoControlador.findAll = function(req, res){
    avaliacao.findAll({
        raw: true
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar as avaliações: `+erro)
        }
    )
}

avaliacaoControlador.findOne = function(req, res){
    avaliacao.findOne({
        raw: true,
        where: {
            idAvaliacao: req.params.id
        }
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar as avaliações: `+erro)
        }
    )
}

avaliacaoControlador.update = function(req, res){
    avaliacao.update({
        nota: req.body.nota
    },{
        where: {
            idAvaliacao: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao atualizar a avaliação: `+erro)
        }
    )
}

avaliacaoControlador.destroy = function(req, res){
    avaliacao.destroy({
        where: {
            idAvaliacao: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao remover a avaliação: `+erro)
        }
    )
}

avaliacaoControlador.abrirVotacao = function(req, res) {
    req.user.nome = "votacao Aberta"
    usuario.findAll({
        raw: true
    }).then((usuarios) => {
        usuarios.forEach(user => {
            axios.put("/usuario/" + user.idUsuario,
                qs.stringify({
                    nome: user.nome,
                    senha: user.senha,
                    votacaoAberta: true,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    proxy: {
                        port: 80
                    }
                }
            ).then((dados) => {
                res.status(200).redirect("/apresentacao")
            }).catch((erro) => {
                res.status(500).send(`Erro ao atualizar o cliente: `+erro)
            })
        });
    }).catch((erro) => {
        res.status(500).send(`Erro ao fechar a votação: `+erro)
    })
}

avaliacaoControlador.fecharVotacao = function(req, res) {
    usuario.findAll({
        raw: true
    }).then((usuarios) => {
        usuarios.forEach(user => {
            axios.put("/usuario/" + user.idUsuario,
                qs.stringify({
                    nome: user.nome,
                    senha: user.senha,
                    votacaoAberta: false,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    proxy: {
                        port: 80
                    }
                }
            ).then((dados) => {
                res.status(200).redirect("/apresentacao")
            }).catch((erro) => {
                res.status(500).send(`Erro ao atualizar o cliente: `+erro)
            })
        });
    }).catch((erro) => {
        res.status(500).send(`Erro ao fechar a votação: `+erro)
    })
}

module.exports = avaliacaoControlador