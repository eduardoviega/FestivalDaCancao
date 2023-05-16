var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")
var apresentacao = require("./apresentacao")
var candidato = require("./candidato")

var avaliacao = banco.define('avaliacao', {
    idAvaliacao: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nota: {
        type: sequelize.INTEGER,
        allowNull: false,
    },
    descricao: {
        type: sequelize.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false    
});

apresentacao.hasOne(avaliacao, { foreignKey: "idApresentacao" });
candidato.hasOne(avaliacao, { foreignKey: "idCandidato" });

avaliacao.sync()

module.exports = avaliacao