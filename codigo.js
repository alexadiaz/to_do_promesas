const readline = require("readline");
var mysql = require("promise-mysql");
const rl = leer_pantalla();

function leer_pantalla(){
    const rl= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return rl;
}

mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"to_do"
}).then(function(conexion){
    conexion.end();
});

