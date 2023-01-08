const basicAuth=require('basic-auth');

module.exports=(req,res,next)=>{
    const usuario=basicAuth(req);
    if (!usuario||usuario.name!=='admin'||usuario.pass !=='1234'){
        res.set('WWW-Authenticate','Basic realm=Authorization required');
        res.sendStatus(401);
        return;
    }
    next();
}