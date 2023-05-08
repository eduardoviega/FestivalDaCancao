var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")
var apresentacao = require("./apresentacao")
var usuario = require("./usuario");
const apre = require("../controllers/apresentacaoController");

var candidato = banco.define('candidato', {
    idCandidato: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

apresentacao.hasOne(candidato, { foreignKey: "idApresentacao" });
usuario.hasOne(candidato, { foreignKey: "idUsuario" });

candidato.sync()

module.exports = candidato