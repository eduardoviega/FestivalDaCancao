var computador = require('../models/computador');
var axios = require("axios")
var qs = require("querystring")

const computadorControlador = {};

// var listaComputadores = []

//CREATE
computadorControlador.inserirComputadorBanco = function (req, res) {
    computador.create({
        descricao: req.body.descricao,
        marca: req.body.marca,
        memoriaRam: req.body.memoriaRam
    }).then(
        function(){
            res.status(200).redirect("/");
        }
    ).catch(
        function(error){
            res.status(500).send("Erro ao criar computador: " + error);
        }
    )
}

//READ
computadorControlador.buscarComputadoresBanco = function(req,res){
    computador.findAll({
        raw: true
    }).then(
        function(dados){
            res.render("inicio",{computadores: dados})
            console.log(dados)
        }
    ).catch(
        function(erro){
            res.status(500).send(`Erro ao buscar os computadores: ${erro}`)
        }
    )
}

//UPDATE
computadorControlador.atualizarComputadorBanco = function (req, res) {
    erros = []
    
    computador.update({
        descricao: req.body.descricao,
        marca: req.body.marca,
        memoriaRam: req.body.memoriaRam
    },{
        where: {
            id: req.params.id
        }
    }).then(
        function(){
            res.sendStatus(200)
        }
    ).catch(
        function(error){
            res.status(500).send("Erro ao atualizar a computador: " + error)
        }
    )
}

//DELETE
computadorControlador.removerComputadorBanco = function (req, res) {
    computador.destroy(
        {
        where: {
            id: req.params.id
        }
    }).then(
        function(){
            res.sendStatus(200)
        }
    ).catch(
        function(error){
            res.status(500).send("Erro ao remover computador: " + error)
        }
    )
}

//métodos do handlebars
computadorControlador.cadastro = function (req, res) {
    try {
        res.render("cadastro")
    } catch (error) {
        res.status(500).send("Erro ao acessar página de cadastro: " + error);
    }
};

//solicitarEditarFormulario
computadorControlador.editarFormulario = function(req,res){
    computador.findOne({
        raw: true,
        where: {
            id: req.params.id
        }
    }).then(
        function(pc){
            res.render("editarForm",{
                idComputador: req.params.id,
                pcDescricao: pc.descricao,
                pcMarca: pc.marca,
                pcMemoriaRam: pc.memoriaRam
            })
        }
    ).catch(
        function(error){
            res.status(500).send("Erro ao acessar página de edição: " + error)
        }
    )
}

//montarRequisiçãoEditar
computadorControlador.montarReqEdicao = function (req, res) {
    axios.put("/" + req.params.id,
        qs.stringify({
            descricao: req.body.descricao,
            marca: req.body.marca,
            memoriaRam: req.body.memoriaRam,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            proxy:{
                host: "localhost",
                port: 80
            }
        }
    ).then(function () {
            res.status(200).redirect("/")
        })
    .catch(function (err) {
        res.status(500).send("Erro ao editar o computador: " + err);
    })
}

//montarRequisiçãoRemover
computadorControlador.montarReqDelete = function (req, res) {
    axios.delete('/' + req.params.id,{
        proxy:{
            host: "localhost",
            port: 80
        }
    }).then(function () {
            res.status(200).redirect("/")
        })
        .catch(function (err) {
            res.status(500).send("Erro ao apagar um computador: " + err);
        })
}

module.exports = computadorControlador;