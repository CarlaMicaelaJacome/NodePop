/*Inicializar la base de datos*/
const readline = require('readline');

const Anuncio = require('./models/Anuncio');

async function main() {
  const continuar = await preguntaSiNo('Quieres eliminar la base de datos, mira lo que le pasó a Peter Parker [n]')
  if (!continuar) {
    process.exit();
  }
  const connection = require('./lib/connectMongoose')
  await initAnuncio();
  connection.close();
}

main().catch(err => console.log('Ha ocurrido un error', err));

async function initAnuncio() {
  const result = await Anuncio.deleteMany();
  console.log(`Eliminados ${result.deletedCount} anuncios.`);
  const inserted = await Anuncio.insertMany([
    {nombre: "guitarra", venta: "true", precio: 250, foto: "nodepop\public\images\guitar.jpg", tags: "musica"},
    {nombre: "libro", venta: "true", precio: 35, foto: "nodepop\public\images\book", tags: "literatura"},
    {nombre: "ordenador", venta: "true", precio: 750, foto: "nodepop\public\images\computer.jpg", tags: "tecnologia"},
    {nombre: "zapatillas", venta: "false", precio: 150, foto: "nodepop\public\images\kicks.jpg", tags: "zapatillas"},
    {nombre: "e-bike", venta: "false", precio: 2350, foto: "nodepop\public\images\bike.jpg", tags: "transporte"},
  ]);
  console.log(`Creados ${inserted.length} anuncios.`)
}

function preguntaSiNo(texto) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.question(texto, respuesta => {
      interface.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  })
}