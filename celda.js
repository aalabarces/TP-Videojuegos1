class Celda {
    constructor(juego, anchoCelda, x, y) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.x = x;
        this.y = y;
        this.xEnPixeles = x * anchoCelda;
        this.yEnPixeles = y * anchoCelda;
        this.centro = {
            x: this.xEnPixeles + anchoCelda / 2,
            y: this.yEnPixeles + anchoCelda / 2
        };
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
            return entidad.tipo == "caja" || entidad.tipo == "almacenamiento";
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

    render(borde) {
        borde.beginFill(0x000000, 0.1);
        borde.drawRect(this.x * this.anchoCelda, this.y * this.anchoCelda, this.anchoCelda, this.anchoCelda);
        borde.stroke({ width: 2, color: this.clickeada ? 0x0000ff : 0x000000 });
        borde.endFill();
        borde.zIndex = -1;
    }
}