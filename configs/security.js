var localStrategy = require("passport-local").Strategy

const { log } = require("console");
//modelo do usuário
var Usuario = require('../models/usuario');

module.exports = function(passport){

    passport.serializeUser((user,done)=>{
        done(null, user.idUsuario)
    })

    passport.deserializeUser( async (id, done)=>{
        try{
            const user = await Usuario.findByPk(id)
            done(null, user)
        }catch(erro){
            done(erro, user)
        }
    })
    
    passport.use(new localStrategy({
        usernameField: 'idUsuario',
        passwordField: 'senha'
    },
    async (idUsuario,senha,done) => {
        try{
            const user = await Usuario.findOne({
                raw: true,
                where: {
                    idUsuario: idUsuario
                }})

            if(!user){
                return done(null,false,{message:"Esta conta não existe"})
            }
            
            const eValido = senha == user.senha

            if(!eValido) return done(null, false, {message: "Senha incorreta!"})
            
            return done(null, user)
        }catch(erro){
            done(erro, false)
        }
    }))
}