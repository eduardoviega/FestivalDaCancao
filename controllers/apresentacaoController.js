const { raw } = require("express")
const usuario = require("../models/usuario")
var apresentacao = require("../models/apresentacao")
var candidato = require("./../models/candidato")
var axios = require("axios")
const qs = require("querystring")

var apresentacaoControlador = {}

apresentacaoControlador.create = function (req, res) {
    apresentacao.create({
        nome: req.body.nome
    }).then(
        function (dados) {
            res.status(200).json({ idApresentacao: dados.idApresentacao });
        }
    ).catch(
        function (erro) {
            res.status(500).send("Erro no cadastro da apresentação: " + erro)
        }
    )
}

apresentacaoControlador.findOne = function (req, res) {
    apresentacao.findOne({
        raw: true,
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function (dados) {
            res.status(200).send(dados)
        }
    ).catch(
        function (erro) {
            res.status(500).send(`Erro ao buscar pela apresentação id ${req.params.id} informada: ` + erro)
        }
    )
}

apresentacaoControlador.findAll = function (req, res) {
    apresentacao.findAll({
        raw: true
    }).then(
        function (dados) {
            res.render("tableApresentacao", { apresentacao: dados.nome })
        }
    ).catch(
        function (erro) {
            res.status(500).send(`Erro ao buscar as apresentações: ` + erro)
        }
    )
}

apresentacaoControlador.update = function (req, res) {
    apresentacao.update({
        nome: req.body.nome,
    }, {
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function (dados) {
            res.sendStatus(200)
        }
    ).catch(
        function (erro) {
            res.status(500).send(`Erro ao atualizar a apresentação: ` + erro)
        }
    )
}

apresentacaoControlador.destroy = function(req, res){
    apresentacao.destroy({
        where: {
            idApresentacao: req.params.id
        }
    }).then(
        function (dados) {
            res.sendStatus(200)
        }
    ).catch(
        function (erro) {
            res.status(500).send(`Erro ao remover a apresentação: ` + erro)
        }
    )
}

// ------------------------------------------------------------------------

apresentacaoControlador.cadastroApresentacao = function (req, res) {
    usuario.findAll({
        raw: true
    }).then((dados) => {
        res.render("cadastroApresentacao", { nome: dados })
    }).catch((erro) => {
        res.status(500).send(`Erro ao buscar os usuários: ` + erro)
    })
}

apresentacaoControlador.cadastroCandidatoApresentacao = function (req, res) {
    apresentacao.create({
        nome: req.body.nome
    }).then((dados) => {
        var idAp = dados.idApresentacao
        var usuarios = req.body.idUsuario.filter((user) => user != "")
        usuarios.forEach(element => {
            candidato.create({
                idApresentacao: idAp,
                idUsuario: element
            }).then(
            ).catch((erro) => {
                res.status(500).send("Erro no cadastro do Candidato: " + erro)
            })
        })
        apresentacaoControlador.listaApresentacaoCandidato(req, res)
    }).catch((erro) => {
        res.status(500).send("Erro no cadastro da apresentação: " + erro)
    })
}

apresentacaoControlador.listaApresentacaoCandidato = function (req, res) {
    apresentacao.findAll({
        raw: true
    }).then((dados) => {
        var apresentacaoUsuarios = []
        dados.forEach((apresentacao) => {
            var usuariosAp = []
            candidato.findAll({
                raw: true,
                where: {
                    idApresentacao: apresentacao.idApresentacao
                }
            }).then((candidatos) => {
                candidatos.forEach((candidato) => {
                    usuario.findOne({
                        raw: true,
                        where: {
                            idUsuario: candidato.idUsuario
                        }
                    }).then((usuario) => {
                        usuariosAp.push({ username: usuario.nome })
                    }).catch((erro) => {
                        res.status(500).send(`Erro ao buscar Usuário: ` + erro)
                    })
                })
            }).catch((erro) => {
                res.status(500).send(`Erro ao buscar Participantes: ` + erro)
            })
            apresentacaoUsuarios.push({ idApresentacao: apresentacao.idApresentacao, nome: apresentacao.nome, usuarios: usuariosAp })
        })
        res.render("tableApresentacao", { apresentacao: apresentacaoUsuarios })
    }).catch((erro) => {
        res.status(500).send(`Erro ao buscar as apresentações: ` + erro)
    })
}

apresentacaoControlador.deleteApresentacaoCandidato = function (req, res) {
    candidato.findAll({
        raw: true,
        where: {
            idApresentacao: req.params.id
        }
    }).then((candidatos) => {
        candidatos.forEach((candidato) => {
            axios.delete('/candidato/'+candidato.idCandidato
            ).then(
            ).catch((erro) => {
                res.status(500).send("Erro na exclusão do Candidato: " + erro)
            })
        })
        axios.delete('/apresentacao/'+req.params.id
        ).then(() => {
            res.status(200).redirect("/apresentacao")
        }).catch((erro) => {
            res.status(500).send("Erro na exclusão da Apresentação: " + erro)
        });
    }).catch((erro) => {
        res.status(500).send("Erro ao buscar Participantes: " + erro)
    })
}

module.exports = apresentacaoControlador