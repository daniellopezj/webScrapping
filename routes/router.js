var news = require('../services/news')

var db = require('../persistence/db');
exports.assignRoutes = function(app) {
    //Insertar datos
    // db.connectDB();
    app.get('/news/:tipo', db.selectNews);
}