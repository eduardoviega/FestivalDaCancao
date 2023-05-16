var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")
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
    }
}, {
    freezeTableName: true,
    timestamps: false    
});

candidato.hasOne(avaliacao, { foreignKey: "idCandidato" });

avaliacao.sync()

module.exports = avaliacao