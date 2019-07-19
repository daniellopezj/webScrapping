const cheerio = require('cheerio');
const request = require('request');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var noticiainfo = {
    'titulo': '',
    'url': '',
    'img': '',
    'autor': '',
    'fecha': '',
    'descripcion': '',
    'tipo': '',
}

exports.connectDB = function() {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("noticias"); //here
        dbase.createCollection("prueba", function(err, res) {
            if (err) throw err;
            console.log("se hace conexion!");
            //db.close(); //close method has also been moved to client obj
        });
        const collection = dbase.collection('prueba');
        insertInfo(collection)
    });
}

function insertInfo(collection) {
    loadnews(collection, 'https://elpais.com/tag/paginas_web/a', "Tecnologia");
    loadnews(collection, 'https://elpais.com/tag/c/da8b5f0ef13205be8acb0b78d7f2a1cf', "Nacionales");
    loadnews(collection, 'https://elpais.com/tag/c/8a04e14f346d7e93abdc29d951c9484a', "Deportes");
    loadnews(collection, 'https://elpais.com/tag/c/8f62f3ef0c14424d458a36951d746a4b', "Cultura");
}

function loadnews(collection, url, tipo) {
    request(url, (err, res, body) => {
        console.log("Entra a request");
        if (!err && res.statusCode == 200) {
            console.log("comienza a recorrer pagina de tecnologia");
            let $ = cheerio.load(body);
            $('article', '.articulos__interior').each(function() {
                noticiainfo.titulo = $(this).find('h2.articulo-titulo > a').text();
                noticiainfo.url = $(this).find('h2.articulo-titulo > a').attr('href');
                noticiainfo.img = $(this).find('img', '.foto-imagen').attr('src');
                noticiainfo.autor = $(this).find('span', '.articulo-metadatos ').text();
                noticiainfo.fecha = $(this).find('time', '.articulo-metadatos').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.articulo-entradilla > a').text().replace("\n", " ");;
                noticiainfo.tipo = tipo;
                collection.insertOne(noticiainfo);
                noticiainfo = new Object;
            });
        }
    });
}

exports.selectNews = function(req, res) {
    console.log(req.params.tipo);
    getConsulta({ "tipo": req.params.tipo }, (documentos) => {
        res.send(documentos);
    })
}

function getConsulta(query, callback) {
    // Create a new MongoClient
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("noticias"); //here
        findDocuments(query, dbase, callback)
            //   client.close();
    });

}

const findDocuments = function(query, db, callback) {
    // Get the documents collection
    const collection = db.collection('noticia');
    // Find some documents
    collection.find(query).toArray(function(err, docs) {
        console.log("Found the following records");
        console.log(docs.length)
        callback(docs);
    });
}