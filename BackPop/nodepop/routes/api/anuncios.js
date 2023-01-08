'use strict'
const express=require('express');
const router=express.Router();
const Anuncio=require('../../models/Anuncio');
const anError=require('http-errors');
/*Anuncios*/

router.get('/',async (req,res,next)=>{
    try{
    /*Filtros*/
    const filter={};

    const tags=req.query.tags; 
    const foto=req.query.foto;
    const precio=req.query.precio;
    const venta=req.query.venta;
    const nombre=req.query.nombre;
    /*Campos*/
    const fields=req.query.fields;
    /*Orden*/
    const sort=req.query.sort;
    /*Páginas*/
    const limit=req.query.limit;
    const skip=req.query.start;
    
    /*Tags*/
    if(tags){filter.tags={$in: tags};}
    /*Fotos*/
    if(foto){filter.foto=foto;}
    /*Precio*/
    if(typeof precio !== 'undefined') {
        var maxMin=precio.split("-");

        if( maxMin.length===1 && maxMin[0] !== '' && !isNaN(maxMin[0]) ){
            filter.precio = maxMin[0];
        }else{
            var min=maxMin[0];
            var max=maxMin[1];

            if( min==='' && !isNaN(max)) {
                filter.precio={$lt: max };
            }else if( max==='' && !isNaN(min)) {
                filter.precio={$gt: min };
            } else {
                if( !isNaN(min) && !isNaN(max) ){
                    filter.precio={$gt: min, $lt: max};
                }

            }
        }

    }
    /*Venta*/
    if(venta){filter.venta=venta;}
    /*Nombre*/
    if(nombre){filter.nombre=nombre;}

    const anuncios=await Anuncio.list(fields,filter,limit,skip,sort);
        res.json({result: anuncios});
    }catch(err){
        next(err);
    }
    
});

/*Devolver anuncios*/
router.get('/:id',async(req,res,next)=>{
    try{
        const id=req.params.id;
        const anuncio=await Anuncio.findById(id);
        res.json({result:anuncio});
    }catch(err){
        next(err);
    }
});
router.get('/tags',async(req,res,next)=>{
    try{
        const tagExistente=await Anuncio.listTags();
        res.json({tags:tagExistente});
    }catch(err){
        next(err);
    }
});
/*Crear anuncio  */
router.post('/:id',(req,res,next)=>{
    const nuevoAnuncio=new Anuncio(req.body);
    nuevoAnuncio.save((err,anuncioGuardado)=>{
        if(err) {return next(err)};
        return res.json({success:true,result:anuncioGuardado});
    });
});
/*Actualizar anuncio*/
router.put('/:id', async (req, res, next) => {
    try {
  
      const id=req.params.id;
      const anuncioData=req.body;
  
      const anuncioActualizado=await Anuncio.findOneAndUpdate({ _id: id}, anuncioData, {
        new: true
      });
  
      res.json({ result: anuncioActualizado });
  
    } catch (err) {
      next(err);
    }
  });
  /*Post*/
  router.post('/:id', async (req, res, next) => {
    try {
      const anuncioData=req.body;
      const anuncio=new Anuncio(anuncioData);
      const anuncioGuardado = await anuncio.save();
      res.json({ result: anuncioGuardado });
    } catch (err) {
      next(err);
    }
  });
  /*Delete*/
  router.delete('/:id', async (req, res, next) => {
    try {
      const id=req.params.id;
      const anuncio=await Anuncio.findById(id);
      if (!anuncio) {
        return next(anError(404));
      }
      await Anuncio.deleteOne({ _id: id });
      res.json();
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;