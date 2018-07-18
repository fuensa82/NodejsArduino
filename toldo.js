var http = require('http');
var express = require('express');
var serialport = require('serialport');

console.log("Ejecutando");

//Parte comunicacion serial con Arduino (inicializaciones)
const portArduino = new serialport('/dev/ttyACM0', {
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

/**
 * Servidor web
 */
var app = express();
app.listen(4321);
app.use(express.static('estaticos'));

app.get('/ponToldo',function(req, res){
    console.log("ponToldo");
    portArduino.write('ponToldo\n', function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.json({resp:"Enviada orden de puesta"});
});
app.get('/quitaToldo',function(req, res){
    console.log("quitaToldo");
    portArduino.write('quitaToldo\n', function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.json({resp:"Enviada orden de quitado"});
 
});

app.get('/paraToldo',function(req, res){
    console.log("paraToldo");
    portArduino.write('paraToldo\n', function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.json({resp:"Enviada orden de parar Toldo"});
 
});

app.get('*',function(req, res){
    console.log("Resto");
    res.json({resp:"Orden no reconocida"});
 
});
