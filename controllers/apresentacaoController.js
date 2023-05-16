const { raw } = require("express")
const usuario = require("../models/usuario")
var apresentacao = require("../models/apresentacao")
var candidato = require("../models/candidato")
var axios = require("axios")
const qs = require("querystring")
const {autenticado, isAdmin} = require("../helpers/acesso")
const {admin} = require("../helpers/acesso")
const avaliacao = require("../models/avaliacao")

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
            res.status(200).send(dados)
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

apresentacaoControlador.destroy = function (req, res) {
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
        dados = dados.filter(user => user.idUsuario != req.user.idUsuario)
        res.render("cadastroApresentacao", { nome: dados, usuario: req.user })
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
        res.status(200).redirect("/apresentacao")
    }).catch((erro) => {
        res.status(500).send("Erro no cadastro da apresentação: " + erro)
    })
}

apresentacaoControlador.listaApresentacaoCandidato = function (req, res) {
    if(isAdmin(req) || req.user.votacaoAberta){
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
                            usuariosAp.push({ username: `${usuario.nome} - ${usuario.idUsuario}` })
                        }).catch((erro) => {
                            res.status(500).send(`Erro ao buscar Usuário: ` + erro)
                        })
                    })
                }).catch((erro) => {
                    res.status(500).send(`Erro ao buscar Participantes: ` + erro)
                })
                apresentacaoUsuarios.push({ idApresentacao: apresentacao.idApresentacao, nome: apresentacao.nome, usuarios: usuariosAp, votacaoAberta: req.user.votacaoAberta })
            })
            res.render("tableApresentacao", { apresentacao: apresentacaoUsuarios, userAdmin: isAdmin(req), votacaoAberta: req.user.votacaoAberta })
        }).catch((erro) => {
            res.status(500).send(`Erro ao buscar as apresentações: ` + erro)
        })
    } else {
        candidato.findAll({
            raw: true,
            where: {
                idUsuario: req.user.idUsuario
            }
        }).then((candidatosLogado) => {
            var apresentacaoUsuarios = []
            candidatosLogado.forEach((candidatoLogado)  => {
                apresentacao.findOne({
                    raw: true,
                    where: {
                        idApresentacao: candidatoLogado.idApresentacao 
                    }
                }).then((apresentacao) => {
                    var candidatoAp = []
                    candidato.findAll({
                        raw: true,
                        where: {
                            idApresentacao: apresentacao.idApresentacao
                        }
                    }).then((candidatos) => {
                        var primeiroCandidato
                        candidatos.forEach((candi) => {
                            usuario.findOne({
                                raw: true,
                                where: {
                                    idUsuario: candi.idUsuario
                                }
                            }).then((usuarioCandi) => {
                                candidatoAp.push({ username: `${usuarioCandi.nome} - ${usuarioCandi.idUsuario}` })
                            })
                            if(primeiroCandidato == null || primeiroCandidato.idCandidato > candi.idCandidato) {
                                primeiroCandidato = candi
                            }
                        })
                        if(primeiroCandidato.idUsuario == req.user.idUsuario){
                            apresentacaoUsuarios.push({ idApresentacao: apresentacao.idApresentacao, nome: apresentacao.nome, usuarios: candidatoAp, votacaoAberta: req.user.votacaoAberta })
                        }
                    })
                })
            })
            res.render("tableApresentacao", { apresentacao: apresentacaoUsuarios, userAdmin: isAdmin(req), votacaoAberta: req.user.votacaoAberta })
        }).catch((erro) => {
            res.status(500).send(`Erro ao buscar as apresentações: ` + erro)
        })
    }
}

// Traz os usuários na página de editar
apresentacaoControlador.editarApresentacaoCandidato = function (req, res) {
    usuario.findAll({
        raw: true
    }).then((dados) => {
        res.render("editarApresentacao", { nome: dados, idApresentacao: req.params.id })
    }).catch((erro) => {
        res.status(500).send(`Erro ao buscar os usuários: ` + erro)
    })
}

// Faz a edição da apresentação
apresentacaoControlador.montarReqEdicao = function (req, res) {
    console.log(req.body.nome);
    axios.put("/apresentacao/" + req.params.id,
        qs.stringify({
            nome: req.body.nome,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            proxy: {
                port: 80
            }
        }
    ).then(() => {
        res.status(200).redirect("/apresentacao")
    }).catch((erro) => {
        res.status(500).send("Erro na edição da Apresentação: " + erro)
    });

    candidato.findAll({
        raw: true,
        where: {
            idApresentacao: req.params.id
        }
    }).then((candidatos) => {
        candidatos.forEach((candidato) => {
            axios.delete('/candidato/' + candidato.idCandidato
            ).then(
            ).catch((erro) => {
                res.status(500).send("Erro na exclusão do Candidato: " + erro)
            })
        })
    }).catch((erro) => {
        res.status(500).send("Erro ao buscar Participantes: " + erro)
    })

    var idAp = req.params.id
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
}

apresentacaoControlador.deleteApresentacaoCandidato = function (req, res) {
    candidato.findAll({
        raw: true,
        where: {
            idApresentacao: req.params.id
        }
    }).then((candidatos) => {
        candidatos.forEach((candidatoAp) => {
            avaliacao.findAll({
                raw: true, 
                where :{
                    idCandidato: candidatoAp.idCandidato
                }
            }).then((avaliacoes) => {
                avaliacoes.forEach((avaliacaoCand) => {
                    axios.delete('/avaliacao/' + avaliacaoCand.idAvaliacao
                    ).catch((erro) => {
                        res.status(500).send("Erro na exclusão do Candidato: " + erro)
                    })
                })
            })

            axios.delete('/candidato/' + candidatoAp.idCandidato
            ).catch((erro) => {
                res.status(500).send("Erro na exclusão do Candidato: " + erro)
            })
        })
        axios.delete('/apresentacao/' + req.params.id
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