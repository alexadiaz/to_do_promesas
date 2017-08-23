const readline = require("readline");
var mysql = require("promise-mysql");
const rl = leer_pantalla();
var conexion = base_datos();

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

function base_datos(){
    return mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"root",
        database:"to_do"
    });
}

function iniciar(accion){
    conexion
    .then(function(conexion){
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
                consulta = preguntar_datos_consultar();
                return consulta;
            break;
            case "ayuda":
                conexion.end();    
                return null;
            break;
            default:
                conexion.end();
                return "La accion no es valida";
            }
    }).then(function(consulta){
        switch (accion){
            case "consultar":
                mostrar_pantalla(consulta);
                rl.close();
            break;
            case "consultar_tarea":
                console.log(consulta);
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

function preguntar_datos_consultar(){
    return new Promise(function(resolve, reject){
        var consulta = null;
        rl.question("Ingrese nombre de la tarea o letras contenidas en ella: ",function(palabra){
            if(palabra !== ""){
                conexion.then (function(conexion){
                    var datos = conexion.query(`SELECT * FROM to_do.tareas WHERE tareas.nombre like '%${palabra}%'`);
                    conexion.end();
                    return (datos);
                }).then (function(datos){
                    if(datos.length === 0){
                        consulta = "No se encontraron coincidencias";
                        resolve (consulta);
                        return;
                    }
                    consulta = datos;
                    resolve(consulta);
                });
                return;
            }
            consulta = "La informacion no debe estar en blanco";
            resolve(consulta);
        });
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