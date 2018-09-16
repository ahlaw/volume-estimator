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
                    let ratio = data.toString('utf-8')/104500;      // Hard coded average volume of an apple
                    
                    // Insert ration into avg values
                    for (key of Object.keys(result)) {
                        result[key] *= ratio;
                    }
                    
                    // console.log(totalCal);
                    // res.sendFile(__dirname + '/index.html');
                    res.writeHeader(200, {"Content-Type": "text/html"});  
                    res.write("<h1>Results Calculated!</h1><p>Total Calories: " + result.ENERC_KCAL.toFixed(2) 
                        + " Calories</p><p>Protein: " + result.PROCNT.toFixed(2) 
                        + " g</p><p>Fat: " + result.FAT.toFixed(2) 
                        + " g</p><p>Carbs: " + result.CHOCDF.toFixed(2) + " g</p>");  
                    res.end();
                });
            })
            .catch(err => {
                console.log(err);
            });
    });

    // res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
console.log("Port open at 3000")
