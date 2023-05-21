var usuario = require("../models/usuario")
var candidato = require("../models/candidato")
var avaliacao = require("../models/avaliacao")
var apresentacao = require("../models/apresentacao")
var axios = require("axios")
const qs = require("querystring")

var usuarioControlador = {}

usuarioControlador.create = function(req, res){
    usuario.create({
        idUsuario: req.body.idUsuario,
        nome: req.body.nome,
        senha: req.body.senha,
        votacaoAberta: false,
        administrador: req.body.administrador
    }).then(
        function(dados) {
            res.render('login')   
        }
    ).catch(
        function(erro) {
            res.status(500).send("Erro no cadastro do cliente: "+erro)    
        }
    )
}

usuarioControlador.findOne = function(req, res){
    usuario.findOne({
        raw: true,
        where: {
            idUsuario: req.params.id
        }
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar pelo cliente id ${req.params.id} informado: `+erro)
        }
    )
}
usuarioControlador.findAll = function(req, res){
    usuario.findAll({
        raw: true
    }).then(
        function(dados){
            res.status(200).send(dados)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao buscar os clientes: `+erro)
        }
    )
}

usuarioControlador.update = function(req, res){
    usuario.update({
        nome: req.body.nome,
        senha: req.body.senha,
        votacaoAberta: req.body.votacaoAberta
    },{
        where: {
            idUsuario: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao atualizar o cliente: `+erro)
        }
    )
}

usuarioControlador.destroy = function(req, res){
    usuario.destroy({
        where: {
            idUsuario: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao remover o cliente: `+erro)
        }
    )
}

//----------------------------------------------------------------------------

usuarioControlador.cadastroUsuario = function (req, res){
    res.render("cadastroUsuario")
}

usuarioControlador.mostrarFormLogin = function (req, res) {
    try {
        req.logout(req.user, erro => {
            if(erro) return next(erro);
            res.render("login")
        })
    } catch (error) {
        res.status(500).send("Erro ao acessar página de login: " + error);
    }
};

usuarioControlador.listaUsuarios = function (req, res) {
    usuario.findAll({
        raw: true
    }).then((usuariosList) => {
        res.render("tableUsuarios", {usuarios: usuariosList})
    }).catch((erro) => {
        res.status(500).send("Erro ao acessar buscar usuários: " + erro);
    })
}

usuarioControlador.montarReqDelete = function (req, res) {
    candidato.findAll({
        raw: true,
        where: {
            idUsuario: req.params.id
        }
    }).then((candidatos) => {
        console.log("candidatos", candidatos);
        candidatos.forEach(candidatoUser => {
            apresentacao.findOne({
                raw: true,
                where: {
                    idApresentacao: candidatoUser.idApresentacao
                }
            }).then((apresentacaoCand) => {
                console.log("apresentacaoCand", apresentacaoCand);
                candidato.findAll({
                    raw: true,
                    where: {
                        idApresentacao: apresentacaoCand.idApresentacao
                    }
                }).then((candidatosAp) => {
                    candidatosAp.forEach(candidatoAp => {
                        console.log("candidatoAp", candidatoAp);
                        avaliacao.findAll({
                            raw: true,
                            where: {
                                idCandidato: candidatoAp.idCandidato
                            }
                        }).then((avaliacoes) => {
                            avaliacoes.forEach((avaliacaoCand) => {
                                axios.delete('/avaliacao/' + avaliacaoCand.idAvaliacao
                                ).catch((erro) => {
                                    res.status(500).send("Erro na exclusão da Avaliacao: " + erro)
                                })
                            })
                        })
                        
                        axios.delete('/candidato/' + candidatoAp.idCandidato
                        ).catch((erro) => {
                            res.status(500).send("Erro na exclusão do Candidato: " + erro)
                        })
                    })
                })
                
                axios.delete('/apresentacao/' + apresentacaoCand.idApresentacao
                ).catch((erro) => {
                    res.status(500).send("Erro na exclusão da Apresentação: " + erro)
                })
            })
        })
        
        axios.delete('/usuario/' + req.params.id
        ).then(() => {
            res.redirect("/listaUsuarios")
        }).catch((erro) => {
            res.status(500).send("Erro na exclusão do Usuário: " + erro)
        })
    })
}

usuarioControlador.editarUsuario = function(req, res){
    usuario.findAll({
        raw: true
    }).then((dados) => {
        res.render("editarUsuario", {idUsuario: req.params.id})
    }).catch((erro) => {
        res.status(500).send(`Erro ao buscar os usuários: ` + erro)
    })
}

usuarioControlador.montarReqEdicaoUsuario = function(req, res){
    axios.put("/usuario/" + req.params.id,
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
        res.status(200).redirect("/listaUsuarios")
    }).catch((erro) => {
        res.status(500).send("Erro na edição da Apresentação: " + erro)
    });
}

module.exports = usuarioControlador