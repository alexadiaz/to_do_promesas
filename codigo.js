const readline = require("readline");
var mysql = require("promise-mysql");
const rl = leer_pantalla();
var conexion = null;

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
    }).then(function(cnx){
         conexion = cnx;
    });
}

function iniciar(accion){
    base_datos()
    .then(function(){
       var consulta = null;
        switch (accion){
            case "insertar":
            break;
            case "renombrar":
            break;
            case "completar":
            break;
            case "borrar":
            break;
            case "consultar":
                consulta = conexion.query("select * from to_do.tareas");
                return consulta;
            break;
            case "consultar_tarea":
                return preguntar_datos_consultar();
            break;
        }
    }).then(function(consulta){
        switch (accion){
            case "consultar":
                mostrar_pantalla(consulta);
            break;
            case "consultar_tarea":
                console.log(consulta);
            break;
            case "ayuda":
               mostrar_ayuda();
            break;
            default:
                console.log("La accion no es valida");
        }
    }).then(function(){
        conexion.end();
        rl.close();
    });    
}

function preguntar_datos_consultar(){
    return new Promise(function(resolve, reject){
        var consulta = null;
        rl.question("Ingrese nombre de la tarea o letras contenidas en ella: ",function(palabra){
            if(palabra !== ""){
                conexion.query(`SELECT * FROM to_do.tareas WHERE tareas.nombre like '%${palabra}%'`)
                .then (function(datos){
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