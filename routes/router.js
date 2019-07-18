var news = require('../services/news')

exports.assignRoutes = function(app) {

    //MANEJO DE EMPRESA
    app.get('/news', news.getone);

    //MANEJO DE PROYECTO
    //  app.get('/showprojects/:id', proyecto.showProjects);
}