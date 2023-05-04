var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")
var apresentacao = require("./apresentacao")
var usuario = require("./usuario")

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

apresentacao.hasOne(candidato, {
    foreignKey: "idApresentacao"
});
candidato.belongsTo(apresentacao, {
    foreignKey: "idApresentacao"
});

usuario.hasOne(candidato, {
    foreignKey: "idUsuario"
});
candidato.belongsTo(usuario, {
    foreignKey: "idUsuario"
});

candidato.sync()

module.exports = candidato