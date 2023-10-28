require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const db = leerDB();
    if (db) {
        tareas.readDB(db)
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
                break;
            case '2':
                (tareas.listarTareas())
                    ? console.log(tareas.listarTareas())
                    : console.log(`\n No existen tareas. ${'Por favor cree una tarea'.red}.`)
                break;
            case '3':
                (tareas.listarCompPend(true))
                    ? console.log(tareas.listarCompPend(true))
                    : console.log(`\n No existen tareas ${'completadas'.red}.`);
                break;
            case '4':
                (tareas.listarCompPend(false))
                ? console.log(tareas.listarCompPend(false))
                : console.log(`\n No existen tareas ${'pendientes'.red}.`);
                break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.checkearTareas(ids);
                break;
            case '6':
                if(!tareas.listarTareas()){
                    console.log(`\n No existen tareas. ${'Por favor cree una tarea'.red}.`)    
                }else{
                    const id = await listadoTareasBorrar(tareas.listadoArr);
                    if(id !== '0'){
                        const ok = await confirmar(`¿Esta segurp de ${'borrar'.red} esta tarea?`)
                        if(ok){
                            tareas.borrarTarea(id);
                            console.log('Tarea borrada');
                        }
                    }
                   
                }
                break;
        }


        console.log('\n')

        if (opt !== '0') {
            await pausa();
        } else {
            const save = await confirmar(`¿Desea ${'guardar'.green} los datos antes de salir?`)
            if (save) {
                await guardarDB(tareas.listadoArr)
                    .then(local => console.log(`\nDatos guardados con ${'exito'.green} en`, local))
                    .catch(error => {
                        console.log('\nError al guardar los datos:'.red);
                        console.log(error);
                    })
            }
        }




    } while (opt !== '0');



}
main();