const cheerio = require('cheerio');
const request = require('request');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

connectDB();
var noticiainfo = {
    'titulo': '',
    'url': '',
    'img': '',
    'autor': '',
    'fecha': '',
    'descripcion': '',
    'tipo': '',
}

function connectDB() {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("noticias"); //here
        dbase.createCollection("noticia", function(err, res) {
            if (err) throw err;
            console.log("se hace conexion!");
            //db.close(); //close method has also been moved to client obj
        });
        const collection = dbase.collection('noticia');

        getInfotecnologhy(collection);
        //  getInfonational(db);
        // getSports(db);
        // getCultura(db);
    });

}

function getInfotecnologhy(collection) {
    request('https://elpais.com/tag/paginas_web/a', (err, res, body) => {
        console.log("Entra a request");
        var count = 0;
        if (!err && res.statusCode == 200) {
            console.log("hace peticion");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticiainfo.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticiainfo.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticiainfo.img = $(this).find('img', '.foto-imagen').attr('src');
                noticiainfo.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticiainfo.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.articulo-entradilla > a').text().replace("\n", " ");;
                noticiainfo.tipo = "Tecnologia";
                collection.insertOne(noticiainfo);
                noticiainfo = new Object;
            });
        }
    });
}

function getInfonational(db) {
    request('https://elpais.com/tag/c/da8b5f0ef13205be8acb0b78d7f2a1cf', (err, res, body) => {
        console.log("Entra a request");
        if (!err && res.statusCode == 200) {
            console.log("hace peticion");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticiainfo.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticiainfo.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticiainfo.img = $(this).find('img', '.foto-imagen').attr('src');
                noticiainfo.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticiainfo.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.articulo-entradilla > a').text();
                noticiainfo.tipo = "Nacionales";
            });
        }
    });
}

function getSports(db) {
    request('https://elpais.com/tag/c/8a04e14f346d7e93abdc29d951c9484a', (err, res, body) => {
        console.log("Entra a request");
        if (!err && res.statusCode == 200) {
            console.log("hace peticion");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticiainfo.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticiainfo.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticiainfo.img = $(this).find('img', '.foto-imagen').attr('src');
                noticiainfo.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticiainfo.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.articulo-entradilla > a').text();
                noticiainfo.tipo = "Deportes";
            });
        }
    });
}

function getCultura(db) {
    request('https://elpais.com/tag/c/8f62f3ef0c14424d458a36951d746a4b', (err, res, body) => {
        console.log("Entra a request");
        if (!err && res.statusCode == 200) {
            console.log("hace peticion");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticiainfo.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticiainfo.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticiainfo.img = $(this).find('img', '.foto-imagen').attr('src');
                noticiainfo.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticiainfo.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.articulo-entradilla > a').text();
                noticiainfo.tipo = "Cultura";
            });
        }
    });
}