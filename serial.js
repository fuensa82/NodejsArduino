
var http = require('http');
var express = require('express');
var serialport = require('serialport');
var delimitadorComandoArduino="*";

console.log("Ejecutando");
var primeraEjecucion=true;
//Parte comunicacion serial con Arduino (inicializaciones)
/*var portArduino = new serialport('COM4', {
    baudrate: 9600,
    parser: serialport.parsers.Read
});*/

//var portArduino = new serialport("/dev/ttyACM0", {
var portArduino = new serialport("COM4", {
    autoOpen: true,
    baudRate:9600
});



const parsers = serialport.parsers;
const parser = new parsers.Readline({
    delimiter: '\n'
});

//parser: serialport.parsers.readline("\n")
portArduino.pipe(parser);

// Switches the port into "flowing mode"
var lectura="";
portArduino.on('data', function (data) {
    leerBuffer(data, delimitadorComandoArduino,acciones);
});

function leerBuffer(data, delimitadorComandoArduino,acciones){
    data=data.toString();
    if(data.substring(data.length-1) ==delimitadorComandoArduino){
        lectura+=data.substring(0,data.length-1);
        acciones(lectura);
        lectura="";
    }else{
        lectura+=data;
    }
}

function acciones(lectura){
    console.log("Datos leidos: "+lectura);
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




