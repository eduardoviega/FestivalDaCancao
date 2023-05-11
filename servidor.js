var express = require("express")
var handlebars = require("express-handlebars")
var rotas = require('./routes/routes')

var aplicacao = express()
var PORTA = 80

aplicacao.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
aplicacao.set("view engine", "handlebars");

aplicacao.use(express.urlencoded({extended: true}))
aplicacao.use(rotas)

aplicacao.listen(PORTA, function(){
    console.log(`Servidor http rodando na porta ${PORTA}...`);
})
