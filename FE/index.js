const express = require('express');
const formidable = require('formidable');
const path = require('path');
const identify = require('./identify');

const app = express();

const public = path.join(__dirname, 'public')

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
        
        identify.getLabels(file.path)
            .then(arr => {
                console.log(arr);
            })
            .catch(err => {
                console.log(err);
            });
    });

    res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
