var express	= require('express')
    , async	= require('async')
    , ROUTES	= require('./routes');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

for(var i in ROUTES) {
    app.get(ROUTES[i].path, ROUTES[i].fn);
}

app.listen(app.get('port'), function() {
    console.log("Listening on " + app.get('port'));
});
