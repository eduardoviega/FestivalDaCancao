var sequelize = require("sequelize")

var conexao = new sequelize("festivalCancao","postgres","25288242",{
    host: "localhost",
    dialect: "postgres"
})

conexao.authenticate().then(
    function(){
        console.log("Conectado ao banco com sucesso!")
    }
).catch(
    function(erro){
        console.log("Erro ao conectar com o banco: "+erro)
    }
)

module.exports = conexao