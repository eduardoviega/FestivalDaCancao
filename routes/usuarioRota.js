var express = require('express')
var userController = require('../controllers/usuarioController')

var rotas = express.Router()

//Rotas da API
rotas.post("/", userController.create);
rotas.get("/:id", userController.findOne);
rotas.get("/", userController.findAll);
rotas.put("/:id", userController.update);
rotas.delete("/:id", userController.destroy);

module.exports = rotas