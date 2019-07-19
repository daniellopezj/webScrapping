const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

connectDB();



var noticia = {
    'titulo': '',
    'url': '',
    'img': '',
    'autor': '',
    'fecha': '',
    'descripcion': '',

}

function connectDB() {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("noticias"); //here
        dbase.createCollection("noticia", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close(); //close method has also been moved to client obj
        });
    });
    getInfo();
}


function getInfo() {
    request('https://elpais.com/tag/paginas_web/a', (err, res, body) => {
        console.log("Entra a request");
        if (!err && res.statusCode == 200) {
            console.log("hace peticion");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticia.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticia.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticia.img = $(this).find('img', '.foto-imagen').attr('src');
                noticia.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticia.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticia.descripcion = $(this).find('p', '.articulo-entradilla > a').text();
                console.log("Titulo    " + noticia.titulo);
                console.log("Url    " + noticia.url);
                console.log("Link imagenes   " + noticia.img);
                console.log("Descripcion   " + noticia.descripcion);

                console.log("Autor    " + noticia.autor);
                console.log("Fecha    " + noticia.fecha);
                console.log("****************************************");

            });
        }
    });
}