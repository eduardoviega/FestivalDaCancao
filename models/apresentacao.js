var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")

var apresentacao = banco.define('apresentacao', {
    idApresentacao: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

apresentacao.sync()

module.exports = apresentacao