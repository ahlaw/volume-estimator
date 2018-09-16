const spawn = require('child_process').spawn;
py = spawn('python', ['test.py', 'hello']);

py.stdout.on('data', function(data){
    console.log(data.toString('utf-8'));
});