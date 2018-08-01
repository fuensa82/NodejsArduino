
var http = require('http');
var express = require('express');
var serialport = require('serialport');
var delimitadorComandoArduino="*";

console.log("Ejecutando");
var primeraEjecucion=true;

//var portArduino = new serialport("/dev/ttyACM0", {
var portArduino = new serialport("COM4", {
    autoOpen: false,
    baudRate:9600
});



const parsers = serialport.parsers;
const parser = new parsers.Readline({
    delimiter: '\n'
});


portArduino.pipe(parser);


var lectura="";
/*portArduino.on('data', function (data) {
    leerBuffer(data, delimitadorComandoArduino,acciones);
});*/

function leerBuffer(data, delimitadorComandoArduino,acciones){
    data=data.toString();
    var n=data.indexOf(delimitadorComandoArduino);
    console.log("leerBuffer: "+data+" -- "+n);
    if(n != -1){
        lectura+=data.substring(0,n);
        acciones(lectura);
        lectura="";
    }else{
        lectura+=data;
    }
}



// Read data that is available but keep the stream from entering "flowing mode"
/*portArduino.on('readable', function () {
    console.log('Data2:', portArduino.read());
});*/

portArduino.write('on', function(err) {
    if (err) {
        return console.log('Error on write: ', err.message);
    }
    console.log('message written on');
});



//Servidor web
var app = express();

//app.use(express.bodyParser());
app.listen(8080);

app.get('/ponToldo',function(req, res){
    console.log("ponToldo");
    portArduino.write('on\n', function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written on');
    });
    res.json({resp:"ok"});
 
});
app.get('/quitaToldo',function(req, res){
    console.log("quitaToldo");
    portArduino.write('off\n', function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('message written on');
    });
    res.json({resp:"Enviada orden de quitado"});
});
app.get('/estadoToldo',function(req, res){
    portArduino.open(function(){
        var promise = new Promise(function(resolve, reject) {
            portArduino.on('data', function (data) {
                console.log("Hay datos en buffer: "+data);
                leerBuffer(data, delimitadorComandoArduino,function(lectura){
                    console.log("FIN Ya se han leido los datos: "+lectura);
                    resolve(lectura);
                });
            });
        });

        portArduino.write('on\n', function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            promise.then(function(lectura){
                portArduino.close();
                res.json({resp:lectura});
            })
        });
    });
});




