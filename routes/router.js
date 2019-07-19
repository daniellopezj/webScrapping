var news = require('../services/news')

var db = require('../persistence/db');
exports.assignRoutes = function(app) {

    //MANEJO DE EMPRESA
    //Insertar datos
    //db.connectDB();
    app.get('/news/:tipo', db.selectNews);

    //MANEJO DE PROYECTO
    //  app.get('/showprojects/:id', proyecto.showProjects);
}