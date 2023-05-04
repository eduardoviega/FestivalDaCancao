var express = require("express")
var servidor = express()

const PORTA = 80

servidor.listen(PORTA, function(){
    console.log("Servidor http rodando na porta " + PORTA + "...");
})

servidor.get("/", function(req, res){
    res.sendFile(__dirname + "/views/login.html")
})

servidor.get("/cadastro", function(req, res){
    res.send("cadastro")
})

servidor.get("/login", function(req, res){
    res.send("login")
})

servidor.get("/votacao", function(req, res){
    res.send("votacao")
})