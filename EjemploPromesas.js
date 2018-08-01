var promise = new Promise(function(resolve, reject) {
    console.log("Ejecutando mogollon de cosas que tardarán 3000");
    setTimeout(()=>{
        resolve("Resolviendo");
    },3000)
});

promise.then(function(result) {
    console.log("FIN: "+result);
}, function(err) {
    console.log(err);
});




