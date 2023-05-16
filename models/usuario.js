var sequelize = require("sequelize")
var banco = require("./../configs/bancoConfig")

var usuario = banco.define('usuario', {
    idUsuario: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false,
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false,
    },
    votacaoAberta: {
        type: sequelize.BOOLEAN,
        allowNull: false,
    },
    administrador: {
        type: sequelize.BOOLEAN,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: false
});

usuario.sync()

module.exports = usuario