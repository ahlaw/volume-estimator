var express = require('express');
var formidable = require('formidable');
var path = require('path');

var app = express();

var public = path.join(__dirname, 'public')

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
