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
            case "renombrar":
            case "completar":
            case "borrar":
                return preguntar_datos(accion);
            break;
            case "consultar":
                return conexion.query("select idtareas,nombre,estado,creacion,finalizacion from to_do.tareas");
            break;
            case "consultar_tarea":
                return preguntar_datos_consultar();
            break;
        }
    }).then(function(consulta){
        switch (accion){
            case "insertar":
            case "renombrar":
            case "completar":
            case "borrar":
                if(consulta !== null){
                    console.log(consulta);
                }
                else{
                    console.log("Accion ejecutada ok");
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

function preguntar_datos(accion){
    var existe_tarea = false;
    return new Promise (function(resolve,reject){
        rl.question("Ingrese nombre de la tarea: ", function(nombre_tarea){
            if (nombre_tarea === ""){
                resolve ("La tarea no debe estar en blanco");
                return;
            }
            else{
                conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
                .then (function(datos){
                    for(var i in datos){
                        if(datos[i].nombre === nombre_tarea){
                            existe_tarea =true;
                            break;
                        }
                    }
                    if(existe_tarea === false){
                        switch (accion){
                            case "insertar":
                                conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${nombre_tarea}','pendiente',now())`);
                                resolve (null);
                                return;
                            break;
                            case "renombrar":
                            case "completar":
                            case "borrar":
                                resolve ("La tarea no existe");
                                return;
                            break;
                        }
                    }
                    else{
                        switch (accion){
                            case "insertar":
                                resolve ("La tarea ya existe");
                                return;
                            break;
                            case "renombrar":
                                resolve (preguntar_datos_renombrar(nombre_tarea)
                                .then (function(consulta){
                                    return consulta;
                                }));
                                return;
                            break;
                            case "completar":
                                resolve (completar(nombre_tarea)
                                .then (function(mensaje){
                                    return mensaje;
                                }));
                                return;
                            break;
                            case "borrar":
                                conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${nombre_tarea}'`);
                                resolve ("Tarea borrada ok");
                            break;
                        }
                    }
                });
            }
        });
    });
}

function preguntar_datos_renombrar(nombre_tarea){
    var existe_tarea = false;
    return new Promise(function(resolve,reject){
        rl.question("Ingrese nuevo nombre de la tarea: ",function(nuevo_nombre_tarea){
            if (nuevo_nombre_tarea === ""){
                resolve ("La tarea no debe estar en blanco");
                return;
            }
            else{
                conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
                .then(function(datos){
                    for(var i in datos){
                        if (datos[i].nombre === nuevo_nombre_tarea){
                            existe_tarea = true;
                            break;
                        }
                    }
                    if (existe_tarea === false){
                        conexion.query(`UPDATE to_do.tareas SET nombre = '${nuevo_nombre_tarea}' WHERE nombre = '${nombre_tarea}'`);
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
        rl.question("Ingrese nombre de la tarea o letras contenidas en ella: ",function(palabra){
            if(palabra !== ""){
                conexion.query(`SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas WHERE tareas.nombre like '%${palabra}%'`)
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

function completar(nombre_tarea){
    return new Promise(function(resolve,reject){
        conexion.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${nombre_tarea}'`)
        .then(function(tarea){
            if (tarea[0].estado === "terminado"){
                resolve ("La tarea ya estaba terminada");
                return;
            }
            else{
                conexion.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${nombre_tarea}'`);
                resolve ("Tarea completada ok");
            }
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