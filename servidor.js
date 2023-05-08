var express = require("express")
var rotas = require('./routes/usuarioRota')

var aplicacao = express()
var PORTA = 80

aplicacao.use(express.urlencoded({extended: true}))
aplicacao.use(rotas)

aplicacao.listen(PORTA, function(){
    console.log(`Servidor http rodando na porta ${PORTA}...`);
})