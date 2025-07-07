class Grilla {
    constructor(juego, anchoCelda) {
        this.juego = juego;
        this.anchoCelda = anchoCelda;
        this.celdaALoAncho = Math.ceil(this.juego.ancho / this.anchoCelda);
        this.celdaALoAlto = Math.ceil(this.juego.alto / this.anchoCelda);

        this.celdas = {};
        this.borde = new PIXI.Graphics();
        this.borde.name = "borde_grilla";
        this.initGrilla().then(() => {
            for (let i = 0; i < Object.keys(this.celdas).length; i++) {
                const celda = this.celdas[Object.keys(this.celdas)[i]];
                celda.obtenerEntidadesAcaYEnCeldasVecinas();
            }
        });
    }


    initGrilla() {
        return new Promise((resolve) => {
            for (let x = 0; x < this.celdaALoAncho; x++) {
                for (let y = 0; y < this.celdaALoAlto; y++) {
                    const celda = new Celda(this.juego, this.anchoCelda, x, y);
                    const hash = this.obtenerHashDePosicion(x, y);
                    this.celdas[hash] = celda;
                    celda.render(this.borde)
                }
            }
            this.juego.containerPrincipal.addChild(this.borde);
            resolve(true);
        });
    }

    obtenerHashDePosicion(x, y) {
        return "x_" + x + "_y_" + y;
    }

    obtenerCeldaEnPosicion(x, y) {
        const nuevaX = Math.floor(x / this.anchoCelda);
        const nuevaY = Math.floor(y / this.anchoCelda);
        const hash = this.obtenerHashDePosicion(nuevaX, nuevaY);

        let celda = this.celdas[hash];

        if (!celda) {
            // console.log("nueva celda", nuevaX, nuevaY);
            celda = this.celdas[hash] = new Celda(
                this.juego,
                this.anchoCelda,
                nuevaX,
                nuevaY
            );
        }

        return celda;
    }

    obtenerCeldaPorHash(hash) {
        return this.celdas[hash];
    }
}