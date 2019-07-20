const cheerio = require('cheerio');
const request = require('request-promise');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var noticiainfo = {
    'titulo': '',
    'url': '',
    'img': '',
    'fecha': '',
    'descripcion': '',
    'tipo': '',
}

exports.connectDB = function() {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("noticias"); //here
        dbase.createCollection("noticia", function(err, res) {
            if (err) throw err;
            console.log("se hace conexion!");
            //db.close(); //close method has also been moved to client obj
        });
        const collection = dbase.collection('prueba');
        insertInfo(collection)
    });
}

function insertInfo(collection) {
    loadnews(collection, 'https://www.npr.org/sections/national/', "national");
    loadnews(collection, 'https://www.npr.org/sections/world/', "world");
    loadnews(collection, 'https://www.npr.org/sections/business/', "business");
    loadnews(collection, 'https://www.npr.org/sections/investigations/', "investigations");
    loadnews(collection, 'https://www.npr.org/sections/technology/', "technology");
}

function loadnews(collection, url, tipo) {

    request(url, (err, res, body) => {
        console.log("Entra a request");
        var count = 1;
        if (!err && res.statusCode == 200) {
            console.log("comienza a recorrer pagina de tecnologia");
            let $ = cheerio.load(body);
            $('article', '.list-overflow').each(function() {
                noticiainfo.titulo = $(this).find('h2', 'item-info').text();
                noticiainfo.url = $(this).find('a', 'item-info').attr('href');
                noticiainfo.img = $(this).find('img', '.item').attr("src");
                noticiainfo.fecha = $(this).find('time', '.item-info').attr('datetime');
                noticiainfo.descripcion = $(this).find('p', '.item-info > a').text().replace("\n", " ");;
                noticiainfo.tipo = tipo;
                if (noticiainfo.img == undefined) {
                    noticiainfo.img = 'https://www.comercturro.com/tiendaonline/documentos/productos/.nofoto.jpg'
                }
                if (noticiainfo.titulo != '') {
                    collection.insertOne(noticiainfo);
                }
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