module.exports = {
    autenticado: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/login")
    },
    admin: function(req,res,next){
        if(req.isAuthenticated() && req.user.administrador){
            return next()
        }
        res.redirect("/login")
    },
    isAdmin: (req) => req.isAuthenticated() && req.user.administrador
}