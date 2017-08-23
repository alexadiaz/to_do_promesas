const readline = require("readline");
var mysql = require("promise-mysql");
const rl = leer_pantalla();

if(process.argv.length > 2){
    iniciar(process.argv[2]);
}
else{
    rl.question("Que accion desea realizar? (Digite ayuda para conocer las acciones): ",function(accion){
        iniciar(accion);
    });    
}

function leer_pantalla(){
    const rl= readline.createInterface({
        input:process.stdin,
        output:process.stdout
    });
    return rl;
}

function iniciar(accion){
    mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"root",
        database:"to_do"
    }).then(function(conexion){
        var consulta = null;
        switch (accion){
            case "insetar":
            break;
            case "renombrar":
            break;
            case "completar":
            break;
            case "borrar":
            break;
            case "consultar":
                consulta = conexion.query("select * from to_do.tareas");
                conexion.end();
                return consulta;
            break;
            case "consultar_tarea":
            break;
            case "ayuda":
                consulta = null;
                conexion.end();
                return consulta;
            break;
            default:
                consulta = "La accion no es valida";
                conexion.end();
                return consulta;
            }
    }).then(function(consulta){
        switch (accion){
            case "consultar":
                mostrar_pantalla(consulta);
                rl.close();
            break;
            case "ayuda":
                mostrar_ayuda();
                rl.close();    
            break;
            default:
                console.log(consulta);
                rl.close();
        }
    });    
}

function mostrar_pantalla(tareas){
    console.log("--------------------------------------------------------------------------------------------------------");
    console.log("   Id   |    Nombre    |      Estado     |        Fecha creacion        |      Fecha finalizacion      |");
    console.log("--------------------------------------------------------------------------------------------------------");
    for (var i in tareas){
        if(tareas[i].finalizacion !== null){
            console.log("   " + tareas[i].idtareas + "      ",tareas[i].nombre + "        ",tareas[i].estado + "        ",tareas[i].creacion.toLocaleString() + "        ",tareas[i].finalizacion.toLocaleString());
        }
        else{
            console.log("   " + tareas[i].idtareas + "      ",tareas[i].nombre + "        ",tareas[i].estado + "        ",tareas[i].creacion.toLocaleString() + "        ");
        }
    }
    console.log("--------------------------------------------------------------------------------------------------------");
}

function mostrar_ayuda(){
    console.log("");
    console.log(" Usted puede realizar las siguientes acciones:   ");
    console.log("----------------------------------------------------------------");
    console.log("            Accion               |     Comando");
    console.log("----------------------------------------------------------------");
    console.log("    Insertar una tarea           |    insertar");
    console.log("    Renombrar una tarea          |    renombrar");
    console.log("    Completar una tarea          |    completar");
    console.log("    Borrar una tarea             |    borrar");
    console.log("    Consultar todas las tareas   |    consultar");
    console.log("    Consultar por tarea          |    consultar_tarea");
    console.log("----------------------------------------------------------------");
}