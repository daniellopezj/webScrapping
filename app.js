var express = require('express');
var app = express();
var morgan = require('morgan');
var routes = require('./routes/router');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}

//Control CORS
app.use(allowCrossDomain);
app.use(morgan('dev'));
app.listen(3000, function() {
    console.log('app listening on port 3000!');
});

//hacer llamado a enrutador
routes.assignRoutes(app);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Se presento un problema!');
});

module.exports = app;