
var http = require('http');
var express = require('express');
var serialport = require('serialport');

console.log("Ejecutando");

//Parte comunicacion serial con Arduino (inicializaciones)
const portArduino = new serialport('COM7', {
    baudRate: 9600
});
const parsers = serialport.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});
portArduino.pipe(parser);

parser.on('data', function(data){
    console.log("Datos lectura ");
    console.log(data);
});

portArduino.write('on\n', function(err) {
    if (err) {
        return console.log('Error on write: ', err.message);
    }
    console.log('message written on');
});



//Servidor web
/*
var server = http.createServer(function(request, response){
    console.log("Peticion Recibida.");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Hola Mundo");
    response.end();
});
server.listen(8080);
 
console.log("Servidor funcionando en http://localhost:8080/");
*/
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



