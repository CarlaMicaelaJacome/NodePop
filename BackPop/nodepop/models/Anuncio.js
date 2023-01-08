'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    nombre: {type: String,index: true},

    venta: {type: Boolean,index: true},

    precio: {type: Number,index:true},

    foto: String,

    tags: {type: [String],index: true}
}, {collection:'anuncios'});

/*Estático*/
anuncioSchema.statics.list = function(filter, skip, limit, fields,sort) {
    const query = Anuncio.find(filter);
    query.skip(skip);
    query.limit(limit);
    query.select(fields);
    query.sort(sort);
    return query.exec();
};
/*Anuncio def*/
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;