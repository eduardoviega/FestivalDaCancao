var avaliacao = require("../models/avaliacao")

var avaliacaoControlador = {}

avaliacaoControlador.create = function(req, res){
    avaliacao.create({
        nota: req.body.nota,
        descricao: req.body.descricao,
        idApresentacao: req.body.idApresentacao,
        idCandidato: req.body.idCandidato
    }).then(
        function(dados) {
            res.status(200).send(`Avaliação na apresentação: ${req.body.idApresentacao}, cadastrada com sucesso!`)
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
        nota: req.body.nota,
        descricao: req.body.descricao
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

module.exports = avaliacaoControlador