class Celda {
    constructor(juego, anchoCelda, x, y) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.x = x;
        this.y = y;
        this.crearContainer();
        this.entidadesAca = [];
        this.celdasVecinas = [];
        this.crearBorde();
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.container.name = "celda";
        this.container.x = this.x * this.anchoCelda;
        this.container.y = this.y * this.anchoCelda;
        this.juego.grilla.container.addChild(this.container);
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
        // devuelve el producto
        // o undefined si no hay ninguno

        let entidadesCerca = this.obtenerEntidadesAcaYEnCeldasVecinas();
        for (let i = 0; i < entidadesCerca.length; i++) {
            const entidad = entidadesCerca[i];
            if (entidad.container.name == "producto" && entidad.tipo == producto) {
                return entidad;
            }
        }
        return null;
    }


    siguienteCeldaEnElCamino() {
        // devuelve la siguiente celda en el camino
        // o undefined si no hay camino

        return this.juego.grilla.obtenerCeldaEnPosicion(this.x + this.anchoCelda, this.y) ||
            this.juego.grilla.obtenerCeldaEnPosicion(this.x - this.anchoCelda, this.y) ||
            this.juego.grilla.obtenerCeldaEnPosicion(this.x, this.y + this.anchoCelda) ||
            this.juego.grilla.obtenerCeldaEnPosicion(this.x, this.y - this.anchoCelda);
    }

    crearBorde() {
        // Agregamos un borde rojo para debug
        const borde = new PIXI.Graphics();
        borde.lineStyle(1, 0xFF0000);
        borde.drawRect(0, 0, this.anchoCelda, this.anchoCelda);
        borde.zIndex = 10000;
        this.container.addChild(borde);
    }
}