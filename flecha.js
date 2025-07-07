class Flecha extends Entidad {
    constructor(x, y, juego, direccion) {
        super(x, y, juego);
        this.celda = juego.grilla.obtenerCeldaEnPosicion(x, y);
        this.direccion = direccion;
    }

    otorgarAceleracion() {
        if (this.direccion === "arriba") {
            return { x: 0, y: -this.juego.CONSTANTE_DE_ACELERACION };
        } else if (this.direccion === "abajo") {
            return { x: 0, y: this.juego.CONSTANTE_DE_ACELERACION };
        } else if (this.direccion === "izquierda") {
            return { x: -this.juego.CONSTANTE_DE_ACELERACION, y: 0 };
        } else if (this.direccion === "derecha") {
            return { x: this.juego.CONSTANTE_DE_ACELERACION, y: 0 };
        }
    }

    update() {
        this.celda.entidadesAca.forEach(element => {
            if (element.container && element.container.name === "cliente") {
                const aceleracion = this.otorgarAceleracion();
                element.aplicarAceleracion(aceleracion.x, aceleracion.y);
            }
        });
    }

}