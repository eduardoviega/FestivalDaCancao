const { raw } = require("express")
var candidato = require("./../models/candidato")

var candidatoControlador = {}

candidatoControlador.create = function(req, res){
    candidato.create({
        idApresentacao: req.body.idApresentacao,
        idUsuario: req.body.idUsuario
    }).then(
        function(dados) {
            res.status(200).send(`Apresentação ${req.body.idApresentacao} cadastrada com sucesso!`)    
            res.status(200).send(`Apresentação ${req.body.idUsuario} cadastrada com sucesso!`)    
        }
    ).catch(
        function(erro) {
            res.status(500).send("Erro no cadastro da apresentação: "+erro)    
        }
    )
}

candidatoControlador.findAll = function(req, res){
    candidato.findAll({
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

candidatoControlador.update = function(req, res){
    candidato.update({
        idUsuario: req.body.idUsuario,
        idApresentacao: req.body.idApresentacao
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

candidatoControlador.destroy = function(req, res){
    candidato.destroy({
        where: {
            idCandidato: req.params.id
        }
    }).then(
        function(dados){
            res.sendStatus(200)
        }
    ).catch(
        function(erro) {
            res.status(500).send(`Erro ao remover o candidato: `+erro)
        }
    )
}

module.exports = candidatoControlador