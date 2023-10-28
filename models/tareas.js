const Tarea = require("./tarea");

class Tareas {
    constructor() {
        this._listado = {}
    }

    get listadoArr() {
        const listadoArr = [];
        Object.keys(this._listado).forEach(key => {
            const tarea = this._listado[key];
            listadoArr.push(tarea);
        })

        return listadoArr;
    }

    crearTarea(desc) {
        const tarea = new Tarea(desc);
        this._listado[tarea.id] = tarea;
    }
    readDB(tareas) {
        tareas.forEach(tarea => {
            this._listado[tarea.id] = tarea;
        })
        console.log(this._listado);
    }
    listarTareas() {
        let salida = '';
        Object.keys(this._listado).forEach((key, i) => {
            const tarea = this._listado[key];
            const { desc, completadoEn } = tarea;
            salida += String(i + 1).green + `. ${desc}:: `;
            (completadoEn)
                ? salida += 'Completado \n'.green
                : salida += 'Pendiente \n'.red;
        })

        return salida
    }

    listarCompPend(complete) {
        let tareasComp = '';
        let tareasPend = '';
        let cont = 0,cont2 = 0;
        Object.keys(this._listado).forEach((key) => {
            const tarea = this._listado[key];
            const { desc, completadoEn } = tarea;
            if (completadoEn) {
                ++cont;
                tareasComp += String(cont).green + `. ${desc} :: ` + `${completadoEn.green} \n`.green;
            } else {
                ++cont2;
                tareasPend += String(cont2).green + `. ${desc} :: ` + 'Pendiente \n'.red;
            }
        })

        if (complete) {
            return tareasComp;
        } else {
            return tareasPend;
        }
    }

    borrarTarea(id){
        if(this._listado[id]){
            delete this._listado[id];
        }
    }

    checkearTareas(ids){
        ids.forEach (id => {
            const tarea = this._listado[id];
            if(!tarea.completadoEn){
                tarea.completadoEn = new Date().toISOString();
            }
        })

        this.listadoArr.forEach(tarea =>{
            if( !ids.includes(tarea.id)){
                this._listado[tarea.id].completadoEn = null;
            }
        })
    }
}

module.exports = Tareas;