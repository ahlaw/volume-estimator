const express = require('express');
const formidable = require('formidable');
const path = require('path');
const identify = require('./identify');
const spawn = require('child_process').spawn;

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

        identify.getNutrients(file.path)
            .then(result => {
                // console.log(result);
                py = spawn('python3', ['volume.py', file.path]);

                py.stdout.on('data', function(data){
                    // console.log(data.toString('utf-8'));
                    console.log(result*data.toString('utf-8')/104500);
                    res.sendFile(__dirname + '/index.html');
                });
            })
            .catch(err => {
                console.log(err);
            });
    });

    // res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
