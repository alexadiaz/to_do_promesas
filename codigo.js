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
        switch (accion){
            case "insertar":
                return preguntar_datos();
            break;
            case "renombrar":
            break;
            case "completar":
            break;
            case "borrar":
            break;
            case "consultar":
                return conexion.query("select * from to_do.tareas");
            break;
            case "consultar_tarea":
                return preguntar_datos_consultar();
            break;
        }
    }).then(function(consulta){
        switch (accion){
            case "insertar":
                if(consulta !== null){
                    console.log(consulta);
                }
                else{
                    console.log("Tarea ingresada ok");
                }
            break;
            case "consultar":
            case "consultar_tarea":
                if(Array.isArray(consulta)){
                    mostrar_pantalla(consulta);
                }
                else{
                    console.log(consulta);
                }
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

function preguntar_datos(){
    var consulta = null;
    var existe_tarea = false;
    return new Promise (function(resolve,reject){
        rl.question("Ingrese nombre de la tarea: ", function(nombre_tarea){
            if (nombre_tarea === ""){
                resolve ("La tarea no debe estar en blanco");
                return;
            }
            else{
                conexion.query("SELECT * FROM to_do.tareas")
                .then (function(datos){
                    for(var i in datos){
                        if(datos[i].nombre === nombre_tarea){
                            existe_tarea =true;
                            break;
                        }
                    }
                    if(existe_tarea === false){
                        conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${nombre_tarea}','pendiente',now())`);
                        resolve (null);
                        return;
                    }
                    else{
                        resolve ("La tarea ya existe");
                    }
                });
            }
        });
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
                        resolve ("No se encontraron coincidencias");
                        return;
                    }
                    resolve(datos);
                });
                return;
            }
            resolve ("La informacion no debe estar en blanco");
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