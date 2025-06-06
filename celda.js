class Celda {
    constructor(juego, anchoCelda, x, y) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.x = x;
        this.y = y;

        this.entidadesAca = [];
        this.celdasVecinas = [];
    }

    ponerEntidad(quien) {
        if (!quien) return;
        this.entidadesAca.push(quien);
    }

    sacarEntidad(quien) {
        if (!quien) return;
        for (let i = 0; i < this.entidadesAca.length; i++) {
            const entidad = this.entidadesAca[i];
            if (quien.id == entidad.id) {
                this.entidadesAca.splice(i, 1);
                return;
            }
        }
    }

    obtenerEntidadesAcaYEnCeldasVecinas() {
        let celdasVecinas = [];
        let entidadesCerca = [];

        celdasVecinas = this.obtenerCeldasVecinas() || [];
        entidadesCerca = celdasVecinas
            .map((celda) => celda && celda.entidadesAca)
            .flat()
            .filter((animal) => !!animal);

        return entidadesCerca;
    }

    obtenerCeldasVecinas() {
        if (this.celdasVecinas.length > 0) return this.celdasVecinas;
        let arr = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                {
                    const newX = this.x + x;
                    const newY = this.y + y;

                    try {
                        const hash = this.juego.grilla.obtenerHashDePosicion(newX, newY);
                        const celda = this.juego.grilla.celdas[hash];
                        if (this != celda) arr.push(celda);
                    } catch (e) { }
                }
            }
        }
        this.celdasVecinas = arr;
        return arr;
    }

    soyTransitable() {
        if (this.entidadesAca.length == 0) return true;
        let hayAlgo = this.entidadesAca.some((entidad) => {
            return entidad.nombre != "caja" && entidad.nombre != "almacenamiento";
        });
        return !hayAlgo;
    }

    buscarProducto(producto) {
        // devuelve el almacenamiento que tiene el producto
        // o undefined si no hay ninguno
        let entidadesCerca = this.obtenerEntidadesAcaYEnCeldasVecinas();
        for (let i = 0; i < entidadesCerca.length; i++) {
            const entidad = entidadesCerca[i];
            if (entidad.nombre == "almacenamiento") {
                if (entidad.hayProducto(producto)) {
                    return entidad;
                }
            }
        }
        return undefined;
    }
}