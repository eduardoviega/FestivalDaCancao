var usuario = require("./../models/usuario")

var usuarioControlador = {}

usuarioControlador.create = function(req, res){
    usuario.create({
        idUsuario: req.body.idUsuario,
        nome: req.body.nome,
        senha: req.body.senha,
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
        senha: req.body.senha
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

usuarioControlador.cadastroUsuario = function(req, res){
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

module.exports = usuarioControlador