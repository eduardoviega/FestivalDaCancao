var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")
var apresentacao = require("./apresentacao")
var candidato = require("./candidato")

var avaliacao = banco.define('avaliacao', {
    idAvaliacao: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    nota: {
        type: sequelize.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false    
});

apresentacao.hasOne(avaliacao, {
    foreignKey: "idApresentacao"
});
avaliacao.belongsTo(apresentacao, {
    foreignKey: "idApresentacao"
});

candidato.hasOne(avaliacao, {
    foreignKey: "idCandidato"
});
avaliacao.belongsTo(candidato, {
    foreignKey: "idCandidato"
});

avaliacao.sync()

module.exports = avaliacao